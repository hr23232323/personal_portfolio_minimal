# Personal Portfolio - Development Makefile
# Simple commands for local development and Docker management

.PHONY: help build up down logs shell clean

help:
	@echo "Portfolio Development Commands:"
	@echo ""
	@echo "Setup & Building:"
	@echo "  make build      - Build Docker image (run once)"
	@echo "  make rebuild    - Rebuild Docker image (force)"
	@echo ""
	@echo "Running:"
	@echo "  make up         - Start development server with hot reload"
	@echo "  make down       - Stop development server"
	@echo ""
	@echo "Debugging:"
	@echo "  make logs       - View live container logs"
	@echo "  make shell      - Access container shell"
	@echo ""
	@echo "Cleanup:"
	@echo "  make clean      - Remove containers and image"
	@echo ""
	@echo "Server will be available at: http://localhost"
	@echo "Hot reload is automatic - just save your files!"

# Build the Docker image
build:
	@echo "Building Docker image..."
	docker build -t portfolio:dev .
	@echo "✓ Build complete. Run 'make up' to start the server."

# Rebuild (force)
rebuild:
	@echo "Rebuilding Docker image (no cache)..."
	docker build --no-cache -t portfolio:dev .
	@echo "✓ Rebuild complete."

# Start the development server with hot reload
up: build
	@echo "Starting development server..."
	@docker ps -a --filter "name=portfolio-dev" --format '{{.ID}}' | xargs -r docker rm -f
	docker run -d \
		--name portfolio-dev \
		-p 80:80 \
		-v $$(pwd):/srv \
		portfolio:dev
	@echo ""
	@echo "✓ Server running at http://localhost"
	@echo "✓ Hot reload enabled - changes auto-refresh"
	@echo ""
	@echo "To view logs: make logs"
	@echo "To stop:      make down"

# Stop the development server
down:
	@echo "Stopping development server..."
	@docker stop portfolio-dev 2>/dev/null || true
	@docker rm portfolio-dev 2>/dev/null || true
	@echo "✓ Server stopped"

# View live logs
logs:
	@echo "Showing container logs (Ctrl+C to exit)..."
	docker logs -f portfolio-dev

# Access container shell
shell:
	@echo "Opening container shell..."
	docker exec -it portfolio-dev /bin/sh

# Clean up all Docker resources
clean:
	@echo "Cleaning up Docker resources..."
	@docker stop portfolio-dev 2>/dev/null || true
	@docker rm portfolio-dev 2>/dev/null || true
	@docker rmi portfolio:dev 2>/dev/null || true
	@echo "✓ Cleanup complete"
