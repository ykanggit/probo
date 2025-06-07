NPM?=	npm
NPX?=	npx
PRETTIER?=	$(NPX) prettier
GO?=	go
DOCKER?=	docker

DOCKER_BUILD_FLAGS?=
DOCKER_BUILD=	DOCKER_BUILDKIT=1 $(DOCKER) build $(DOCKER_BUILD_FLAGS)

DOCKER_COMPOSE=	$(DOCKER) compose -f compose.yaml $(DOCKER_COMPOSE_FLAGS)

VERSION=	0.32.0
LDFLAGS=	-ldflags "-X 'main.version=$(VERSION)' -X 'main.env=prod'"
GCFLAGS=	-gcflags="-e"

GO_BUILD=	CGO_ENABLED=$(CGO_ENABLED) GOOS=$(GOOS) $(GO) build $(LDFLAGS) $(GCFLAGS)
GO_GENERATE=	$(GO) generate

DOCKER_IMAGE_NAME=	ghcr.io/getprobo/probo
DOCKER_TAG_NAME?=	latest

PROBOD_BIN=	bin/probod
PROBOD_SRC=	cmd/probod/main.go

.PHONY: all
all: build

.PHONY: lint
lint: fmt-check vet

.PHONY: vet
vet:
	$(GO) vet ./...

.PHONY: build
build: @probo/console bin/probod

.PHONY: docker-build
docker-build:
	$(DOCKER_BUILD) --tag $(DOCKER_IMAGE_NAME):$(DOCKER_TAG_NAME) --file Dockerfile .

.PHONY: bin/probod
bin/probod: pkg/server/api/console/v1/schema/schema.go pkg/server/api/console/v1/types/types.go pkg/server/api/console/v1/v1_resolver.go vet
	$(GO_BUILD) -o $(PROBOD_BIN) $(PROBOD_SRC)

.PHONY: @probo/console
@probo/console: NODE_ENV=production
@probo/console:
	$(NPM) --workspace $@ run typecheck
	$(NPM) --workspace $@ run build

pkg/server/api/console/v1/schema/schema.go \
pkg/server/api/console/v1/types/types.go \
pkg/server/api/console/v1/v1_resolver.go: pkg/server/api/console/v1/gqlgen.yaml pkg/server/api/console/v1/schema.graphql
	$(GO_GENERATE) ./pkg/server/api/console/v1

.PHONY: fmt
fmt: fmt-go

.PHONY: fmt-go
fmt-go:
	go fmt ./...

.PHONY: clean
clean:
	$(RM) -rf bin/*
	$(RM) -rf node_modules
	$(RM) -rf apps/console/{dist,node_modules}

.PHONY: stack-up
stack-up:
	$(DOCKER_COMPOSE) up -d

.PHONY: stack-down
stack-down:
	$(DOCKER_COMPOSE) down

.PHONY: stack-ps
stack-ps:
	$(DOCKER_COMPOSE) ps

.PHONY: psql
psql:
	$(DOCKER_COMPOSE) exec postgres psql -U probod -d probod

