FROM golang:1.23 AS builder
WORKDIR /workdir
COPY go.mod go.sum ./
RUN --mount=type=cache,target=/go/pkg/mod \
    go mod download
COPY . .
RUN --mount=type=cache,target=/root/.cache/go-build \
    make bin/probod

FROM ubuntu:22.04
WORKDIR /app
RUN useradd -m probo && \
    apt-get update && \
    apt-get install -y ca-certificates && \
    rm -rf /var/lib/apt/lists/*
COPY --from=builder /workdir/bin /usr/local/bin/
USER probo
ENTRYPOINT ["probod"]
