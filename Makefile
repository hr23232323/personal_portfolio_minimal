# Personal Portfolio - Development Makefile
# Commands for developing both old and new website versions

.PHONY: help old new old-up old-down old-logs old-clean new-up new-down new-logs new-clean

help:
	@echo "Portfolio Development Commands:"
	@echo ""
	@echo "Old Website (original design):"
	@echo "  make old         - Build old website Docker image"
	@echo "  make old-up      - Start old website server"
	@echo "  make old-down    - Stop old website server"
	@echo "  make old-logs    - View old website logs"
	@echo "  make old-clean   - Clean old website Docker resources"
	@echo ""
	@echo "New Website (minimal design):"
	@echo "  make new         - Build new website Docker image"
	@echo "  make new-up      - Start new website server"
	@echo "  make new-down    - Stop new website server"
	@echo "  make new-logs    - View new website logs"
	@echo "  make new-clean   - Clean new website Docker resources"
	@echo ""
	@echo "Servers will be available at:"
	@echo "  Old: http://localhost:8080"
	@echo "  New: http://localhost:8081"
	@echo ""
	@echo "Hot reload is automatic - just save your files!"

# ============================================================
# OLD WEBSITE COMMANDS
# ============================================================

old:
	@echo "Building old website Docker image..."
	docker build -t portfolio-old:dev ./old_website
	@echo "✓ Build complete. Run 'make old-up' to start the server."

old-up: old
	@echo "Starting old website server..."
	@docker ps -a --filter "name=portfolio-old-dev" --format '{{.ID}}' | xargs -r docker rm -f
	docker run -d \
		--name portfolio-old-dev \
		-p 8080:80 \
		-v $$(pwd)/old_website:/srv \
		portfolio-old:dev
	@echo ""
	@echo "✓ Old website running at http://localhost:8080"
	@echo "✓ Hot reload enabled - changes auto-refresh"
	@echo ""
	@echo "To view logs: make old-logs"
	@echo "To stop:      make old-down"

old-down:
	@echo "Stopping old website server..."
	@docker stop portfolio-old-dev 2>/dev/null || true
	@docker rm portfolio-old-dev 2>/dev/null || true
	@echo "✓ Old website server stopped"

old-logs:
	@echo "Showing old website logs (Ctrl+C to exit)..."
	docker logs -f portfolio-old-dev

old-clean:
	@echo "Cleaning up old website Docker resources..."
	@docker stop portfolio-old-dev 2>/dev/null || true
	@docker rm portfolio-old-dev 2>/dev/null || true
	@docker rmi portfolio-old:dev 2>/dev/null || true
	@echo "✓ Old website cleanup complete"

# ============================================================
# NEW WEBSITE COMMANDS
# ============================================================

new:
	@echo "Building new website Docker image..."
	docker build -t portfolio-new:dev ./new_website
	@echo "✓ Build complete. Run 'make new-up' to start the server."

new-up: new
	@echo "Starting new website server..."
	@docker ps -a --filter "name=portfolio-new-dev" --format '{{.ID}}' | xargs -r docker rm -f
	docker run -d \
		--name portfolio-new-dev \
		-p 8081:80 \
		-v $$(pwd)/new_website:/srv \
		portfolio-new:dev
	@echo ""
	@echo "✓ New website running at http://localhost:8081"
	@echo "✓ Hot reload enabled - changes auto-refresh"
	@echo ""
	@echo "To view logs: make new-logs"
	@echo "To stop:      make new-down"

new-down:
	@echo "Stopping new website server..."
	@docker stop portfolio-new-dev 2>/dev/null || true
	@docker rm portfolio-new-dev 2>/dev/null || true
	@echo "✓ New website server stopped"

new-logs:
	@echo "Showing new website logs (Ctrl+C to exit)..."
	docker logs -f portfolio-new-dev

new-clean:
	@echo "Cleaning up new website Docker resources..."
	@docker stop portfolio-new-dev 2>/dev/null || true
	@docker rm portfolio-new-dev 2>/dev/null || true
	@docker rmi portfolio-new:dev 2>/dev/null || true
	@echo "✓ New website cleanup complete"
