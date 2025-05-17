FROM node:22 AS frontend-builder
WORKDIR /workdir
COPY . .
RUN npm ci
RUN npm run build

FROM golang:1.24 AS backend-builder
WORKDIR /workdir
COPY go.mod go.sum ./
RUN --mount=type=cache,target=/go/pkg/mod \
    go mod download
COPY . .
COPY --from=frontend-builder /workdir/apps/console/dist ./apps/console/dist
RUN --mount=type=cache,target=/root/.cache/go-build \
    make bin/probod

FROM ubuntu:24.04
LABEL org.opencontainers.image.source="https://github.com/getprobo/probo"
LABEL org.opencontainers.image.licenses="MIT"
LABEL org.opencontainers.image.vendor="Probo Inc"
WORKDIR /app
RUN useradd -m probo && \
    apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y ca-certificates && \
    rm -rf /var/lib/apt/lists/*
COPY --from=backend-builder /workdir/bin /usr/local/bin/
USER probo
ENTRYPOINT ["probod"]
