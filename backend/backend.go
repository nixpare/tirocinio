package backend

import (
	"context"
	"errors"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/nixpare/process"
)

type Backend struct {
	vite *process.Process
	srv  http.Server
	db   *database
}

func NewBackend(httpPort int, reactPort int, mongoURL string, dbName string) (*Backend, error) {
	b := new(Backend)
	var err error

	b.db, err = newMongoDB(mongoURL, dbName)
	if err != nil {
		return nil, err
	}

	b.srv = http.Server{
		Addr:    fmt.Sprintf(":%d", httpPort),
		Handler: b.Routes(reactPort),
	}

	b.vite, err = startVite()
	if err != nil {
		return nil, err
	}

	return b, nil
}

func (b *Backend) Close() error {
	err := stopVite(b.vite)
	if err != nil {
		return err
	}

	ctx, cancel := context.WithTimeout(context.Background(), time.Second*5)
	defer cancel()

	err = b.srv.Shutdown(ctx)
	if err != nil {
		return err
	}

	err = b.db.close()
	if err != nil {
		return err
	}

	return nil
}

func (b *Backend) Start() {
	go func() {
		err := b.srv.ListenAndServe()
		if err != nil && !errors.Is(err, http.ErrServerClosed) {
			log.Fatalln(err)
		}

		fmt.Println("HTTP server stopped")
	}()

	fmt.Println("HTTP server started")
}
