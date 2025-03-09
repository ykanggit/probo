// Copyright (c) 2025 Probo Inc <hello@getprobo.com>.
//
// Permission to use, copy, modify, and/or distribute this software for any
// purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.
//
// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
// REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
// AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
// INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
// LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
// OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
// PERFORMANCE OF THIS SOFTWARE.

package web

import (
	"io/fs"
	"log"
	"net/http"

	"github.com/getprobo/probo/apps/console"
)

type Server struct {
	spaFS http.FileSystem
}

func NewServer() (*Server, error) {
	subFS, err := fs.Sub(console.StaticFiles, "dist")
	if err != nil {
		return nil, err
	}

	log.Printf("Using embedded SPA")
	return &Server{
		spaFS: http.FS(subFS),
	}, nil
}

func (s *Server) ServeSPA(w http.ResponseWriter, r *http.Request) {
	path := r.URL.Path

	if path == "/" {
		path = "/index.html"
	}

	f, err := s.spaFS.Open(path)
	if err == nil {
		defer f.Close()

		http.FileServer(s.spaFS).ServeHTTP(w, r)
		return
	}

	indexFile, err := s.spaFS.Open("/index.html")
	if err != nil {
		http.Error(w, "Not Found", http.StatusNotFound)
		return
	}
	defer indexFile.Close()

	stat, err := indexFile.Stat()
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	content := make([]byte, stat.Size())
	_, err = indexFile.Read(content)
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.WriteHeader(http.StatusOK)
	w.Write(content)
}

func (s *Server) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	s.ServeSPA(w, r)
}
