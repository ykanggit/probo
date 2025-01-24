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

package probod

import (
	"context"
	"errors"
	"fmt"
	"net"
	"net/http"
	"sync"
	"time"

	"github.com/getprobo/probo/pkg/api"
	"github.com/getprobo/probo/pkg/probo"
	"github.com/prometheus/client_golang/prometheus"
	"go.gearno.de/kit/httpserver"
	"go.gearno.de/kit/log"
	"go.gearno.de/kit/pg"
	"go.gearno.de/kit/unit"
	"go.opentelemetry.io/otel/trace"
)

type (
	Implm struct {
		cfg config
	}

	config struct {
		Pg  pgConfig  `json:"pg"`
		Api apiConfig `json:"api"`
	}
)

var (
	_ unit.Configurable = (*Implm)(nil)
	_ unit.Runnable     = (*Implm)(nil)
)

func New() *Implm {
	return &Implm{
		cfg: config{
			Api: apiConfig{
				Addr: "localhost:8080",
				Cors: corsConfig{
					AllowedOrigins: []string{"http://localhost:3000"},
				},
			},
			Pg: pgConfig{
				Addr:     "localhost:5432",
				Username: "probod",
				Password: "probod",
				Database: "probod",
				PoolSize: 100,
			},
		},
	}
}

func (impl *Implm) GetConfiguration() any {
	return impl.cfg
}

func (impl *Implm) Run(
	parentCtx context.Context,
	l *log.Logger,
	r prometheus.Registerer,
	tp trace.TracerProvider,
) error {
	wg := sync.WaitGroup{}
	ctx, cancel := context.WithCancelCause(parentCtx)
	defer cancel(context.Canceled)

	pgClient, err := pg.NewClient(
		impl.cfg.Pg.Options(
			pg.WithLogger(l),
			pg.WithRegisterer(r),
			pg.WithTracerProvider(tp),
		)...,
	)
	if err != nil {
		return fmt.Errorf("cannot create pg client: %w", err)
	}

	probo, err := probo.NewService(ctx, pgClient)
	if err != nil {
		return fmt.Errorf("cannot create probo service: %w", err)
	}

	apiServer, err := api.NewServer(
		api.Config{
			Probo:          probo,
			AllowedOrigins: impl.cfg.Api.Cors.AllowedOrigins,
		},
	)
	if err != nil {
		return fmt.Errorf("cannot create api server: %w", err)
	}

	apiServerCtx, stopApiServer := context.WithCancel(context.Background())
	defer stopApiServer()
	wg.Add(1)
	go func() {
		defer wg.Done()
		if err := impl.runApiServer(apiServerCtx, l, r, tp, apiServer); err != nil {
			cancel(fmt.Errorf("api server crashed: %w", err))
		}
	}()

	<-ctx.Done()

	stopApiServer()

	wg.Wait()

	return context.Cause(ctx)
}

func (impl *Implm) runApiServer(
	ctx context.Context,
	l *log.Logger,
	r prometheus.Registerer,
	tp trace.TracerProvider,
	handler http.Handler,
) error {
	apiServer := httpserver.NewServer(
		impl.cfg.Api.Addr,
		handler,
		httpserver.WithLogger(l),
		httpserver.WithRegisterer(r),
		httpserver.WithTracerProvider(tp),
	)

	l.Info("starting api server", log.String("addr", apiServer.Addr))

	listener, err := net.Listen("tcp", apiServer.Addr)
	if err != nil {
		return fmt.Errorf("cannot listen on %q: %w", apiServer.Addr, err)
	}
	defer listener.Close()

	serverErrCh := make(chan error, 1)
	go func() {
		err := apiServer.Serve(listener)
		if err != nil && !errors.Is(err, http.ErrServerClosed) {
			serverErrCh <- fmt.Errorf("cannot server http request: %w", err)
		}
		close(serverErrCh)
	}()

	l.Info("api server started")

	select {
	case err := <-serverErrCh:
		return err
	case <-ctx.Done():
	}

	l.InfoCtx(ctx, "shutting down api server")

	shutdownCtx, cancel := context.WithTimeout(context.Background(), time.Second*10)
	defer cancel()

	if err := apiServer.Shutdown(shutdownCtx); err != nil {
		return fmt.Errorf("cannot shutdown api server: %w", err)
	}

	return ctx.Err()
}
