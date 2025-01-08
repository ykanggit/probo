NPX?=	npx
PRETTIER?=	$(NPX) prettier

.PHONY: all
all: fmt

.PHONY: fmt
fmt:
	$(PRETTIER) --write --prose-wrap always controls/**/*.md

.PHONY: fmt-check
fmt-check:
	$(PRETTIER) --check --prose-wrap always controls/**/*.md
