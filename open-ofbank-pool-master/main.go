// +build go1.9

package main

import (
	"encoding/json"
	"log"
	"math/rand"
	"os"
	"path/filepath"
	"runtime"
	"time"

	"github.com/yvasiyarov/gorelic"

	"github.com/sammy007/open-ethereum-pool/api"
	"github.com/sammy007/open-ethereum-pool/payouts"
	"github.com/sammy007/open-ethereum-pool/proxy"
	"github.com/sammy007/open-ethereum-pool/storage"
)

var cfg proxy.Config
var backend *storage.RedisClient

func startProxy() {
	s := proxy.NewProxy(&cfg, backend)
	s.Start()
}

func startApi() {
	// api创建，传入一个Api json，一个Redis后端
	s := api.NewApiServer(&cfg.Api, backend)
	s.Start()
}

func startBlockUnlocker() {
	u := payouts.NewBlockUnlocker(&cfg.BlockUnlocker, backend)
	u.Start()
}

func startPayoutsProcessor() {
	u := payouts.NewPayoutsProcessor(&cfg.Payouts, backend)
	u.Start()
}

func startNewrelic() {
	if cfg.NewrelicEnabled {
		nr := gorelic.NewAgent()
		nr.Verbose = cfg.NewrelicVerbose
		nr.NewrelicLicense = cfg.NewrelicKey
		nr.NewrelicName = cfg.NewrelicName
		nr.Run()
	}
}

func readConfig(cfg *proxy.Config) {
	configFileName := "config.json"
	if len(os.Args) > 1 {
		configFileName = os.Args[1]
	}
	configFileName, _ = filepath.Abs(configFileName)
	log.Printf("Loading config: %v", configFileName)

	configFile, err := os.Open(configFileName)
	if err != nil {
		log.Fatal("File error: ", err.Error())
	}
	defer configFile.Close()
	jsonParser := json.NewDecoder(configFile)
	if err := jsonParser.Decode(&cfg); err != nil {
		log.Fatal("Config error: ", err.Error())
	}
}

func main() {
	// 读取本地配置信息
	readConfig(&cfg)
	// 设置随机数种子
	rand.Seed(time.Now().UnixNano())

	// 设置最大线程
	if cfg.Threads > 0 {
		runtime.GOMAXPROCS(cfg.Threads)
		log.Printf("Running with %v threads", cfg.Threads)
	}

	startNewrelic()

	// 后端数据Redis
	backend = storage.NewRedisClient(&cfg.Redis, cfg.Coin)

	pong, err := backend.Check()
	if err != nil {
		log.Printf("Can't establish connection to backend: %v", err)
	} else {
		log.Printf("Backend check reply: %v", pong)
	}

	if cfg.Proxy.Enabled {
		// 代理
		go startProxy()
	}
	if cfg.Api.Enabled {
		// api
		go startApi()
	}
	if cfg.BlockUnlocker.Enabled {
		// 解锁区块
		go startBlockUnlocker()
	}
	if cfg.Payouts.Enabled {
		// 支付
		go startPayoutsProcessor()
	}
	// 退出 一直在取，
	quit := make(chan bool)
	<-quit
}
