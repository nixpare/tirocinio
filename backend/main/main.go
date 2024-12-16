package main

import (
	"backend"
	"log"
	"net/http"
	"os"
	"os/signal"

	"github.com/nixpare/nix"
	"github.com/nixpare/server/v3"
)

func main() {
	if len(os.Args) < 2 {
		log.Fatalln("Config file path needed as argument")
	}

	conf, err := backend.LoadConfig(os.Args[1])
	if err != nil {
		log.Fatalf("Failed loading config file: %v\n", err)
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
