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
	"net/http"

	"github.com/getprobo/probo/apps/console"
)

type Server struct {
	spaFS        http.FileSystem
	indexContent []byte
}

func NewServer() (*Server, error) {
	subFS, err := fs.Sub(console.StaticFiles, "dist")
	if err != nil {
		return nil, err
	}

	indexFile, err := subFS.Open("index.html")
	if err != nil {
		return nil, err
	}
	defer indexFile.Close()

	stat, err := indexFile.Stat()
	if err != nil {
		return nil, err
	}

	indexContent := make([]byte, stat.Size())
	_, err = indexFile.Read(indexContent)
	if err != nil {
		return nil, err
	}

	return &Server{
		spaFS:        http.FS(subFS),
		indexContent: indexContent,
	}, nil
}

func (s *Server) ServeSPA(w http.ResponseWriter, r *http.Request) {
	path := r.URL.Path

	f, err := s.spaFS.Open(path)
	if err == nil {
		defer f.Close()
		http.FileServer(s.spaFS).ServeHTTP(w, r)
		return
	}

	w.Header().Set("Cache-Control", "no-cache, no-store, must-revalidate")
	w.Header().Set("Pragma", "no-cache")
	w.Header().Set("Expires", "0")
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.WriteHeader(http.StatusOK)
	w.Write(s.indexContent)
}

func (s *Server) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	s.ServeSPA(w, r)
}
