NODE_BIN = node_modules/.bin

lint:
	@echo Linting...
	@$(NODE_BIN)/standard --verbose | $(NODE_BIN)/snazzy src/
test: lint

.PHONY: test
