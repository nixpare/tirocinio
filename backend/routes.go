package backend

import (
	"fmt"
	"net/http"
	"net/http/httputil"
	"net/url"
)

func (b *Backend) Routes(reactPort int) http.Handler {
	mux := new(http.ServeMux)
	proxy := httputil.NewSingleHostReverseProxy(&url.URL{
		Scheme: "http",
		Host: fmt.Sprintf("localhost:%d", reactPort),
	})

	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusMethodNotAllowed)
		w.Write([]byte("method not allowed"))
	})
	
	mux.Handle("GET /", proxy)

	mux.HandleFunc("GET /bones", b.db.getAllBones)

	mux.HandleFunc("POST /", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("bad request"))
	})

	return mux
}
