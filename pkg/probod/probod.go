package probod

import (
	"context"
	"fmt"

	"github.com/prometheus/client_golang/prometheus"
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
		Pg pgConfig `json:"pg"`
	}
)

var (
	_ unit.Configurable = (*Implm)(nil)
	_ unit.Runnable     = (*Implm)(nil)
)

func New() *Implm {
	return &Implm{
		cfg: config{
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

	_, err := pg.NewClient(
		impl.cfg.Pg.Options(
			pg.WithLogger(l),
			pg.WithRegisterer(r),
			pg.WithTracerProvider(tp),
		)...,
	)
	if err != nil {
		return fmt.Errorf("cannot create pg client: %w", err)
	}

	l.InfoCtx(parentCtx, "started")

	<-parentCtx.Done()

	l.InfoCtx(parentCtx, "stopped")

	return nil
}
