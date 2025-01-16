package main

import (
	"context"

	"github.com/getprobo/probo/pkg/probod"
	"go.gearno.de/kit/unit"
)

var (
	version string = "unknown"
	env     string = "unknow"
)

func main() {
	impl := probod.New()
	unit := unit.NewUnit(impl, "probod", version, env)
	err := unit.Run()
	if err != nil && err != context.Canceled {
		panic(err)
	}
}
