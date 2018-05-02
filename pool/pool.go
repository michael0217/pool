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
	"strings"
	"sync"
	"time"
	"github.com/ethereum/ethash"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/common/math"
	"github.com/gorilla/mux"
)

var (
	currWork  *ResponseArray = nil
	currHash  string
	//currNonce uint64 = 0
	//nonceStep uint64 = 2000000
	blockdiff int64
	lock      sync.Mutex
)

var pendingBlockNumber uint64 = 0
var pendingBlockDifficulty *big.Int

var invalidRequest = `{
  "id":64,
  "jsonrpc": "2.0",
  "result": false,
  "error": "invalid request"
}`

var okRequest = `{
  "id":64,
  "jsonrpc": "2.0",
  "result": true
}`

var pow256 = math.BigPow(2, 256)

var hasher = ethash.New()

var (
	url      string = "http://127.0.0.1:8888"
	poolPort string = "5082"
)

var logInfo *log.Logger
var logError *log.Logger

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
	rpcaddr := flag.String("rpcaddr", "127.0.0.1", "rpc ip")
	rpcport := flag.String("rpcport", "8888", "rpc port")
	poolport := flag.String("poolport", "5082", "pool port")
	//step := flag.Uint64("step", 2000000, "length of workload to miner !")
	flag.Parse()
	poolPort = *poolport
	//nonceStep = *step
	url = fmt.Sprintf("http://%s:%s", *rpcaddr, *rpcport)
}

func main() {
	// Set up logging
	logInfo = log.New(os.Stderr, "INFO: ", log.Ldate|log.Ltime)
	logError = log.New(os.Stderr, "ERROR: ", log.Ldate|log.Ltime)
	logInfo.Println("Welcome to ethpool 2.0")
	logInfo.Println("Pool port is", poolPort)
	//logInfo.Println("Point your miners to: http://192.168.1.37:" + poolPort + "/miner")

	get_cfg()
	logInfo.Println("url = ", url)
	// Open the share database

	go updateWork()
	go updatePendingBlock()

	rout := mux.NewRouter()
	rout.HandleFunc("/miner", handleMiner)
	//rout.HandleFunc("", handleMiner)
	http.Handle("/", rout)
	http.ListenAndServe(":5082", nil)
}

func handleMiner(rw http.ResponseWriter, req *http.Request) {

	//logInfo.Println("请求来了")
	decoder := json.NewDecoder(req.Body)
	//fmt.Println(req.Body)
	var t Request
	err := decoder.Decode(&t)
	if err != nil {
		logError.Println("Invalid JSON request: ", err,req.Body)
		fmt.Fprint(rw, getErrorResponse("Invalid JSON request"))
		return
	}

	if t.Method == "ofbank_getWork" {
		//logInfo.Println("请求工作")
		difficulty := pendingBlockDifficulty
		// Send the response
		//log.Println("start send work!")
		fmt.Fprint(rw, getWorkPackage(difficulty))
	} else if t.Method == "eth_submitHashrate" {
		// 提交hash率
		fmt.Fprint(rw, okRequest)
	} else if t.Method == "eth_submitWork" {
		log.Println("提交工作")
		paramsOrig := t.Params[:]
		// 失效的运算结果
		if paramsOrig[1].(string) != currHash {
			logError.Println("hash is not available ! ", paramsOrig[1].(string))
			return
		}
		log.Println("submit work! ", currHash)

		hashNoNonce := t.Params[1].(string)
		nonce, err := strconv.ParseUint(strings.Replace(t.Params[0].(string), "0x", "", -1), 16, 64)
		if err != nil {
			logError.Println("Invalid nonce provided: ", err)
			fmt.Fprint(rw, getErrorResponse("Invalid nonce provided"))
			return
		}

		mixDigest := t.Params[2].(string)

		myBlockRealDiff := block{
			number:      pendingBlockNumber,
			hashNoNonce: common.HexToHash(hashNoNonce),
			difficulty:  pendingBlockDifficulty,
			nonce:       nonce,
			mixDigest:   common.HexToHash(mixDigest),
		}

		//fmt.Println("Share is valid")
		if hasher.Verify(myBlockRealDiff) {
			_,err := submitWork(paramsOrig)
			if err == nil {
				logInfo.Println("###########################################################################")
				logInfo.Println("################################Block found################################")
				logInfo.Println("###########################################################################")
			}else {
				logInfo.Println("提交失败")
			}
			//lock.Lock()
			////currNonce = uint64(0)
			//defer lock.Unlock()
			//logInfo.Println("###########################################################################")
			//logInfo.Println("################################Block found################################")
			//logInfo.Println("###########################################################################")
		}

		fmt.Fprint(rw, okRequest)
	} else {
		logError.Println("Method " + t.Method + " not implemented!")
		fmt.Fprint(rw, getErrorResponse("Method "+t.Method+" not implemented!"))
	}
}

func getWorkPackage(difficulty *big.Int) string {

	//if nil == currWork || 0 == currNonce {
	//	fmt.Println(currWork,currNonce)
	//	logInfo.Println("没有任务",currWork,currNonce)
	//	return getErrorResponse("Current work unavailable")
	//}
	//lock.Lock()
	//currNonce += nonceStep
	//lock.Unlock()

	if nil == currWork {
		//fmt.Println(currWork,currNonce)
		logInfo.Println("没有任务",currWork)
		return getErrorResponse("Current work unavailable")
	}

	// Our response object
	response := &ResponseArray{
		Id:      currWork.Id,
		Jsonrpc: currWork.Jsonrpc,
		Result:  currWork.Result[:],
	}

	diff := strconv.FormatInt(blockdiff, 10)
	response.Result[2] = diff

	//fmt.Println(response)

	// Convert respone object to JSON

	//number := strconv.FormatUint(pendingBlockNumber, 10)
	//nonce := strconv.FormatUint(currNonce, 10)
	//step := strconv.FormatUint(nonceStep, 10)
	//response.Result = append(response.Result, number)
	//response.Result = append(response.Result, nonce)
	//response.Result = append(response.Result, step)

	//log.Println("send work, content = ", response)
	b, err := json.Marshal(response)
	if err != nil {
		logError.Println("send work by JOSN RPC error: ", err)
		return ""
	}
	//fmt.Println(string(b))
	return string(b)

}

func updateWork() {
	for true {
		currWorkNew, err := callArray("eth_getWork", []interface{}{})
		if err == nil {

			if currWorkNew.Result == nil {
				time.Sleep(time.Millisecond * 200)
				continue
			}

			if currHash == currWorkNew.Result[0].(string) {
				//logInfo.Println("新的任务跟当前任务一致")
				time.Sleep(time.Millisecond * 200)
				continue
			}

			currWork = currWorkNew
			currHash = currWork.Result[0].(string)

		} else {
			currWork = nil
			logError.Println("update work error: ", err)
		}

		//fmt.Println("Current work", currWork.Result[0])
		time.Sleep(time.Millisecond * 200)
	}
}

func submitWork(params []interface{}) (*ResponseBool, error) {
	result, err := callBool("eth_submitWork", params)
	return result, err
}

func updatePendingBlock() {
	params := []interface{}{"pending", false}

	for true {
		time.Sleep(time.Millisecond * 1000)

		block, err := callJSON("eth_getBlockByNumber", params)
		if err == nil {
			blockNbr, err := strconv.ParseUint(strings.Replace(block.Result["number"].(string), "0x", "", -1), 16, 64)
			if err != nil {
				logError.Panicln("get block number error: ", err)
			} else if pendingBlockNumber != blockNbr {

				pendingBlockNumber = blockNbr

				blockDiff, err := strconv.ParseInt(strings.Replace(block.Result["difficulty"].(string), "0x", "", -1), 16, 64)
				if err != nil {
					logError.Println("get block difficulty error: ", err)
				} else {
					pendingBlockDifficulty = big.NewInt(blockDiff)
					blockdiff = blockDiff
				}
			}
		}
	}
}

func callArray(method string, params []interface{}) (*ResponseArray, error) {

	jsonReq := &Request{
		Id:      1,
		Jsonrpc: "2.0",
		Method:  method,
		Params:  params,
	}
	reqJSON, _ := json.Marshal(jsonReq)
	// fmt.Println(string(reqJSON))
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(reqJSON))
	//fmt.Println("Url variable:",url)
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
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}
   //fmt.Println("body response:",string(body))
	// fmt.Println(string(body))
	res := &ResponseArray{}

	if err := json.Unmarshal(body, res); err != nil {
		logError.Println("Ethereum client returned unexpected data", err)
		return nil, errors.New("Ethereum client returned unexpected data")
	}

	// fmt.Println("done")
	return res, nil
}

func callBool(method string, params []interface{}) (*ResponseBool, error) {

	jsonReq := &Request{
		Id:      1,
		Jsonrpc: "2.0",
		Method:  method,
		Params:  params,
	}
	reqJSON, _ := json.Marshal(jsonReq)
	// fmt.Println(string(reqJSON))
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

	// fmt.Println(string(body))
	res := &ResponseBool{}

	if err := json.Unmarshal(body, res); err != nil {
		logError.Println("Ethereum client returned unexpected data", err)
		return nil, errors.New("Ethereum client returned unexpected data")
	}

	fmt.Println("done")
	return res, nil
}

func callJSON(method string, params []interface{}) (*ResponseJSON, error) {

	jsonReq := &Request{
		Id:      1,
		Jsonrpc: "2.0",
		Method:  method,
		Params:  params,
	}
	reqJSON, _ := json.Marshal(jsonReq)
	// fmt.Println(string(reqJSON))
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

	// fmt.Println(string(body))
	res := &ResponseJSON{}

	if err := json.Unmarshal(body, res); err != nil {
		logError.Println("Ethereum client returned unexpected data", err)
		return nil, errors.New("Ethereum client returned unexpected data")
	}

	// fmt.Println("done")
	return res, nil
}

func getErrorResponse(errorMsg string) string {
	return `{
    "id":64,
    "jsonrpc": "2.0",
    "result": false,
    "error": "` + errorMsg + `"
  }`
}
