package main

import (
	"backend"
	"log"

	"github.com/nixpare/process"
)

func main() {
	b, err := backend.NewBackend(httpPort, reactPort, mongoURL, dbName)
	if err != nil {
		log.Fatalln(err)
	}

	defer func() {
		err := b.Close()
		if err != nil {
			log.Fatalln(err)
		}
	}()

	b.Start()

	<- process.ListenForCTRLC()
}
