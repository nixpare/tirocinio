package backend

import (
	"fmt"
	"net/http"
	"net/http/httputil"
	"net/url"
)

func Routes(db *Database, staticHandler http.Handler, reactPort int, redirectToReact *bool) http.Handler {
	mux := new(http.ServeMux)

	proxy := httputil.NewSingleHostReverseProxy(&url.URL{
		Scheme: "http",
		Host: fmt.Sprintf("localhost:%d", reactPort),
	})

	proxy.ErrorHandler = func(w http.ResponseWriter, r *http.Request, err error) {
		w.WriteHeader(http.StatusBadGateway)
		w.Write([]byte(err.Error()))
	}

	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusMethodNotAllowed)
		w.Write([]byte("method not allowed"))
	})
	
	mux.HandleFunc("GET /", func(w http.ResponseWriter, r *http.Request) {
		if !*redirectToReact && staticHandler != nil {
			staticHandler.ServeHTTP(w, r)
			return
		}

		proxy.ServeHTTP(w, r)
	})

	mux.HandleFunc("GET /bones", db.getAllBones)
	mux.HandleFunc("GET /body/{bodyName}", db.getBody)

	mux.HandleFunc("PUT /", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("bad request"))
	})

	mux.HandleFunc("PUT /body/{bodyName}/bones", db.updateBodyBones)

	return mux
}
