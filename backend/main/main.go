package main

import (
	"backend"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"os/signal"

	"github.com/nixpare/nix"
	"github.com/nixpare/server/v3"
)

type config struct {
	HTTPPort    int    `json:"http_port"`
	StaticDir   string `json:"static_dir"`
	ReactPort   int    `json:"react_port"`
	RedirectToReact bool `json:"redirect_to_react"`
	MongoURL    string `json:"mongo_url"`
	MongoDBName string `json:"mongo_db_name"`
}

func main() {
	if len(os.Args) < 2 {
		log.Fatalln("Config file path needed as argument")
	}

	data, err := os.ReadFile(os.Args[1])
	if err != nil {
		log.Fatalf("Failed reading config file: %v\n", err)
	}

	var conf config
	err = json.Unmarshal(data, &conf)
	if err != nil {
		log.Fatalf("Failed parsing config file: %v\n", err)
	}

	db, err := backend.NewMongoDB(conf.MongoURL, conf.MongoDBName)
	if err != nil {
		log.Fatalln(err)
	}
	defer db.Close()

	srv, err := server.NewHTTPServer("", conf.HTTPPort)
	if err != nil {
		log.Fatalln(err)
	}
	
	routes := backend.Routes(
		db,
		http.FileServerFS(os.DirFS(conf.StaticDir)),
		conf.ReactPort,
		&conf.RedirectToReact,
	)
	
	srv.Handler = nix.NewHandler(
		func(ctx *nix.Context) {
			routes.ServeHTTP(ctx, ctx.R())
		},
		nix.EnableLoggingOption(), nix.EnableRecoveryOption(),
		nix.EnableErrorCaptureOption(), nix.ErrorTemplateOption(nix.DefaultErrTemplate()),
	)

	err = srv.Start()
	if err != nil {
		log.Fatalln(err)
	}
	defer srv.Stop()

	exitC := make(chan os.Signal, 1)
	defer close(exitC)

	signal.Notify(exitC, os.Interrupt)
	defer signal.Stop(exitC)

	<- exitC
}
