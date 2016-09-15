NODE_BIN = node_modules/.bin
SRC = src
DIST = lib

lint:
	@echo Linting...
	@$(NODE_BIN)/standard --verbose | $(NODE_BIN)/snazzy src/

test: lint
	@ echo Testing...
	@$(NODE_BIN)/ava test/*.test.js --timeout=10s

cover: lint
	@echo Testing...
	@$(NODE_BIN)/nyc --reporter=lcov $(NODE_BIN)/ava test/*.test.js
	@$(NODE_BIN)/nyc report

coveralls: cover
	@cat ./coverage/lcov.info | $(NODE_BIN)/coveralls --verbose

babel:
	@ echo Babel converting...
	@$(NODE_BIN)/babel $(SRC) --out-dir $(DIST)

publish: test babel
	@echo NPM publishing...
	@npm publish

.PHONY: lint test babel cover coveralls publish
