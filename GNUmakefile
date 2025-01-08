NPX?=	npx
PRETTIER?=	$(NPX) prettier

CONTROL_SRC:=	$(shell find ./controls -type f -name "*.md")

.PHONY: all
all: fmt

.PHONY: fmt
fmt:
	$(PRETTIER) --write --prose-wrap always $(CONTROL_SRC)

.PHONY: fmt-check
fmt-check:
	$(PRETTIER) --check --prose-wrap always $(CONTROL_SRC)
