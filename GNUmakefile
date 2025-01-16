NPX?=	npx
PRETTIER?=	$(NPX) prettier
GO?=	go
DOCKER?=	docker

DOCKER_COMPOSE=	$(DOCKER) compose -f compose.yaml $(DOCKER_COMPOSE_FLAGS)

VERSION=	unknown
LDFLAGS=	-ldflags "-X 'main.version=$(VERSION)' -X 'main.env=prod'"
GCFLAGS=	-gcflags="-e"

GO_BUILD=	CGO_ENABLED=$(CGO_ENABLED) GOOS=$(GOOS) $(GO) build $(LDFLAGS) $(GCFLAGS)

CONTROL_SRC:=	$(shell find ./controls -type f -name "*.md")

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
build: bin/probod

.PHONY: bin/probod
bin/probod:
	$(GO_BUILD) -o $(PROBOD_BIN) $(PROBOD_SRC)

.PHONY: fmt
fmt:
	$(PRETTIER) --write --prose-wrap always $(CONTROL_SRC)

.PHONY: fmt-check
fmt-check:
	$(PRETTIER) --check --prose-wrap always $(CONTROL_SRC)

.PHONY: clean
clean:
	$(RM) -rf bin/*

.PHONY: stack-up
stack-up:
	$(DOCKER_COMPOSE) up -d

.PHONY: stack-down
stack-down:
	$(DOCKER_COMPOSE) down

.PHONY: stack-ps
stack-ps:
	$(DOCKER_COMPOSE) ps
