package probod

import (
	"go.gearno.de/kit/pg"
)

type (
	pgConfig struct {
		Addr     string `json:"addr"`
		Username string `json:"username"`
		Password string `json:"password"`
		Database string `json:"database"`
		PoolSize int32  `json:"pool-size"`
	}
)

func (cfg pgConfig) Options(options ...pg.Option) []pg.Option {
	opts := []pg.Option{
		pg.WithAddr(cfg.Addr),
		pg.WithUser(cfg.Username),
		pg.WithPassword(cfg.Password),
		pg.WithDatabase(cfg.Database),
		pg.WithPoolSize(cfg.PoolSize),
	}

	opts = append(opts, options...)

	return opts
}
