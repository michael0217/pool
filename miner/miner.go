package main

import (
	"bytes"
	"encoding/json"
	"errors"
	"flag"
	"fmt"
	"io/ioutil"
	"log"
	"math/big"
	"net/http"
	"os"
	"strconv"
	"github.com/ethereum/go-ethereum/common"
	"runtime"
	"github.com/ethereum/ethash"
	"time"
	"sync"
	"bufio"
)



// 当前工作 结构体指针
var currWork *ResponseArray = nil


// 工作证明实类
var (
	//currNumber uint64
	hasher   = ethash.New()
	currHash int64
)

var (
	url string = "http://127.0.0.1:5082/miner"
	ip string
)

var logInfo *log.Logger
var logError *log.Logger

var mining bool
var abort = make(chan struct{})

//var breakCompute = make(chan struct{})

type ResponseArray struct {
	Id      int           `json:"id"`
	Jsonrpc string        `json:"jsonrpc"`
	Result  []interface{} `json:"result"`
}

type ResponseJSON struct {
	Id      int                    `json:"id"`
	Jsonrpc string                 `json:"jsonrpc"`
	Result  map[string]interface{} `json:"result"`
}

type ResponseBool struct {
	Id      int    `json:"id"`
	Jsonrpc string `json:"jsonrpc"`
	Result  bool   `json:"result"`
}

type Request struct {
	Id      int           `json:"id"`
	Jsonrpc string        `json:"jsonrpc"`
	Method  string        `json:"method"`
	Params  []interface{} `json:"params"`
}

type block struct {
	difficulty  *big.Int
	hashNoNonce common.Hash
	nonce       uint64
	mixDigest   common.Hash
	number      uint64
}

func (b block) Difficulty() *big.Int     { return b.difficulty }
func (b block) HashNoNonce() common.Hash { return b.hashNoNonce }
func (b block) Nonce() uint64            { return b.nonce }
func (b block) MixDigest() common.Hash   { return b.mixDigest }
func (b block) NumberU64() uint64        { return b.number }

func get_cfg() {
	//rpcaddr := flag.String("rpcaddr", "127.0.0.1", "rpc ip")
	//rpcaddr := flag.String("rpcaddr", "192.168.1.37", "rpc ip")
	rpcaddr := flag.String("rpcaddr", ip, "rpc ip")
	rpcport := flag.String("rpcport", "5082", "rpc port")
	flag.Parse()
	url = fmt.Sprintf("http://%s:%s/miner", *rpcaddr, *rpcport)
}

// 主函数
func main() {

	reader := bufio.NewReader(os.Stdin)
	fmt.Print("your pool ip is:")
	data,_,_ := reader.ReadLine()

	ip = string(data)

	runtime.GOMAXPROCS(runtime.NumCPU())

	// 日志初始化
	logInfo = log.New(os.Stderr, "INFO: ", log.Ldate|log.Ltime)
	logError = log.New(os.Stderr, "ERROR: ", log.Ldate|log.Ltime)
	logInfo.Println("Welcome to OFBankPool 1.0")

	get_cfg()
	//logInfo.Println("url = ", url)
	// 更新区块数据
	updatePendingBlock()

}

func sealWork(currWork *ResponseArray, abort chan struct{}) {

	var (
		blockDifficulty int64
		err             error
		threads         int = runtime.NumCPU()
	)
	//fmt.Println(currWork)
	blockDifficulty, err = strconv.ParseInt(currWork.Result[2].(string), 0, 64)
	if err != nil {
		logError.Printf("seal work error: %+v", err)
		mining = false
		return
	}

	myBlock := &block{
		//number:      number,
		difficulty:  big.NewInt(blockDifficulty),
		hashNoNonce: common.HexToHash(currWork.Result[0].(string)),
	}

	var stop = make(chan struct{}, threads)
	var l = sync.Mutex{}

	var th = 0
	mining = true
	for i := 0; i < threads; i++ {
		th++
		//fmt.Println("第",th,"线程")

		go func() {
			currNonce, md := hasher.Search(myBlock, stop, 0)

			if mining {
				l.Lock()
				th--
				if th < 0 {
					th = 0
				}
				l.Unlock()
			}



			myBlock.nonce = currNonce
			myBlock.mixDigest = common.BytesToHash(md)

			if hasher.Verify(myBlock) {

				if mining {
					// 挖矿中
					l.Lock()
					mining = false
					l.Unlock()

					submitTask := make([]interface{}, 3)

					// nonce 必须为偶数位长度
					nonceStr := strconv.FormatUint(currNonce, 16)
					if len(nonceStr)%2 != 0 {
						nonceStr = "0" + nonceStr
					}
					submitTask[0] = fmt.Sprintf("0x%s", nonceStr)
					submitTask[1] = currWork.Result[0].(string)
					//submitTask[1] = currWork.Result[0]
					submitTask[2] = common.BytesToHash(md).Hex()

					fmt.Println("提交工作")

					abort <- struct{}{}
					submitWork(submitTask)
				}
			}
		}()
	}

L:
	for {
		select {
		case <-abort:
			l.Lock()
			var t = th - 1
			mining = false
			currWork = nil
			currHash = 0
			for i := 0; i < t; i ++ {
				th--
				stop <- struct{}{}
			}
			l.Unlock()
			break L
		}
	}
}

// 提交工作
func submitWork(params []interface{}) {
	_, err := callBool("eth_submitWork", params)
	if err != nil {
		logInfo.Printf("submit error: %+v", err)
		// 请求失败了,也发一个停止的信号
		abort <- struct{}{}
		currWork = nil
		currHash = 0

	}
}

// 更新区块
func updatePendingBlock() {

	var (
		//threads     int = runtime.NumCPU()
		currHashNew int64
		//difficulty 	uint64
	)

	for true {
		time.Sleep(time.Millisecond * 500)
		//var pend sync.WaitGroup
		currWorkNew, err := callArray("ofbank_getWork", []interface{}{})
		//fmt.Println(currWorkNew)
		//logInfo.Println(currWorkNew)
		if err != nil {
			logInfo.Println("new work info", currWorkNew)
			logError.Println("get new work error: ", err)
		} else {

			if currWorkNew.Result == nil {
				fmt.Println("获取的任务为空")
				continue
			}

			currHashNew, err = strconv.ParseInt(currWorkNew.Result[2].(string), 0, 64)
			if err != nil {
				logError.Println("get difficulty error: ", err,currHashNew)
				continue
			}
			if currHash == currHashNew {
				continue
			}

			if mining {
				abort <- struct{}{}
			}

			currHash = currHashNew
			currWork = currWorkNew

			fmt.Println("开始工作",currHash,currWork.Result[0])

			go sealWork(currWorkNew, abort)

		}

	}

}

// 更新工作..
func callArray(method string, params []interface{}) (*ResponseArray, error) {
	jsonReq := &Request{
		Id:      1,
		Jsonrpc: "2.0",
		Method:  method,
		Params:  params,
	}
	reqJSON, _ := json.Marshal(jsonReq)
	//fmt.Println(string(reqJSON))
	//logInfo.Print(url)
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(reqJSON))

	if err != nil {
		logError.Println("Could not create POST request", err)
		return nil, errors.New("Could not create POST request")
	}

	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		logError.Println("Could not send POST request to Ethereum client", err)

		return nil, errors.New("Could not send POST request to Ethereum client")
	}

	defer resp.Body.Close()
	body, _ := ioutil.ReadAll(resp.Body)

	//fmt.Println(string(body))

	res := &ResponseArray{}
	//fmt.Println(res.Result)
	if err := json.Unmarshal(body, &res); err != nil {

		//fmt.Println(res, url)
		logError.Println("Ethereum client returned unexpected data", err)
		return nil, errors.New("Ethereum client returned unexpected data")
	}
	//logInfo.Print("更新工作")
	// fmt.Println("done",res)
	return res, nil
}

// 提交工作.
func callBool(method string, params []interface{}) (*ResponseBool, error) {

	jsonReq := &Request{
		Id:      1,
		Jsonrpc: "2.0",
		Method:  method,
		Params:  params,
	}
	logInfo.Printf("params = %+v", params)
	reqJSON, _ := json.Marshal(jsonReq)
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(reqJSON))

	if err != nil {
		logError.Println("Could not create POST request", err)
		return nil, errors.New("Could not create POST request")
	}

	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		logError.Println("Could not send POST request to Ethereum client", err)
		return nil, errors.New("Could not send POST request to Ethereum client")
	}

	defer resp.Body.Close()
	body, _ := ioutil.ReadAll(resp.Body)

	fmt.Println(string(body))
	res := &ResponseBool{}

	if err := json.Unmarshal(body, res); err != nil {
		fmt.Println("======================================")
		//fmt.Println(res,url)
		logError.Println("Ethereum client returned unexpected data", err)

		return nil, errors.New("Ethereum client returned unexpected data")
	}
	logInfo.Print("mine done !")
	return res, nil
}

