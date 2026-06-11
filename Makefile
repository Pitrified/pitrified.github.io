# pitrified.github.io - dev tasks. Run `make` (or `make help`) for the menu.

PORT           ?= 8000
REPOMGR_DIR    ?= $(HOME)/repos/repomgr
REPOMGR_CONFIG ?= $(HOME)/repos/linux-box-cloudflare/configs/repomgr/repos.toml

.DEFAULT_GOAL := help
.PHONY: help serve sitemap check graph

help: ## Show this help
	@echo "pitrified.github.io"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-10s\033[0m %s\n", $$1, $$2}'

serve: ## Serve the site locally at http://localhost:$(PORT)
	@echo "serving on http://localhost:$(PORT)/  (ctrl-c to stop)"
	@python3 -m http.server $(PORT)

sitemap: ## Regenerate sitemap.md (live links + broken-link check)
	@python3 tools/gen_sitemap.py

check: ## Check for broken internal links only (no file written)
	@python3 tools/gen_sitemap.py --check

graph: ## Regenerate the dependency graph (needs the repomgr env)
	@cd $(REPOMGR_DIR) && uv run python $(CURDIR)/tools/gen_graph.py --config $(REPOMGR_CONFIG)
