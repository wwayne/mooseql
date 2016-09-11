NODE_BIN = node_modules/.bin
SRC = src
DIST = lib

lint:
	@echo Linting...
	@$(NODE_BIN)/standard --verbose | $(NODE_BIN)/snazzy src/

test:
	@ echo Testing...
	@$(NODE_BIN)/ava test/*.test.js --timeout=10s

babel:
	@ echo Babel converting...
	@$(NODE_BIN)/babel $(SRC) --out-dir $(DIST)

.PHONY: lint test babel
