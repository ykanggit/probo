FROM ubuntu:24.04

LABEL org.opencontainers.image.source="https://github.com/getprobo/probo"
LABEL org.opencontainers.image.licenses="MIT"
LABEL org.opencontainers.image.vendor="Probo Inc"

RUN useradd -m probo && \
    apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y ca-certificates && \
    rm -rf /var/lib/apt/lists/*

COPY probod /usr/local/bin/probod
RUN chmod +x /usr/local/bin/probod

USER probo

ENTRYPOINT ["probod"]
