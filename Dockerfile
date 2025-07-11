# syntax=docker/dockerfile:1
FROM ubuntu:24.04

LABEL org.opencontainers.image.source="https://github.com/getprobo/probo"
LABEL org.opencontainers.image.licenses="MIT"
LABEL org.opencontainers.image.vendor="Probo Inc"

WORKDIR /app

# Install dependencies and create user
RUN useradd -m probo && \
    apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Copy the architecture-specific pre-built binary from GoReleaser
COPY probod /usr/local/bin/probod

# Ensure the binary is executable
RUN chmod +x /usr/local/bin/probod

USER probo

ENTRYPOINT ["probod"]
