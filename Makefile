# Personal Portfolio - Development & Production Makefile

# Production Variables
GCP_PROJECT=harsh-personal-projects-misc
APP_NAME=portfolio

.PHONY: help dev up down logs clean build-musings new-musing set-gcp-project build-cloud push deploy

help:
	@echo "Portfolio Development Commands:"
	@echo ""
	@echo "Development:"
	@echo "  make dev           - Build website Docker image"
	@echo "  make up            - Start website server"
	@echo "  make down          - Stop website server"
	@echo "  make logs          - View website logs"
	@echo "  make clean         - Clean Docker resources"
	@echo "  make build-musings - Convert markdown musings to HTML"
	@echo "  make new-musing SLUG=my-post - Create new musing template"
	@echo ""
	@echo "Production Deployment (Cloud Run):"
	@echo "  make deploy        - Build musings, build image, push, and deploy to Cloud Run"
	@echo "  make build-cloud   - Build Docker image for Cloud Run"
	@echo "  make push          - Push image to GCR"
	@echo ""
	@echo "Server will be available at:"
	@echo "  http://localhost:8080"
	@echo ""
	@echo "Hot reload is automatic - just save your files!"

# ============================================================
# DEVELOPMENT COMMANDS
# ============================================================

dev:
	@echo "Building website Docker image..."
	docker build -t portfolio:dev .
	@echo "✓ Build complete. Run 'make up' to start the server."

up: dev build-musings
	@echo "Starting website server..."
	@docker ps -a --filter "name=portfolio-dev" --format '{{.ID}}' | xargs -r docker rm -f
	docker run -d \
		--name portfolio-dev \
		-p 8080:80 \
		-v $$(pwd):/srv \
		portfolio:dev
	@echo ""
	@echo "✓ Website running at http://localhost:8080"
	@echo "✓ Hot reload enabled - changes auto-refresh"
	@echo ""
	@echo "To view logs: make logs"
	@echo "To stop:      make down"

down:
	@echo "Stopping website server..."
	@docker stop portfolio-dev 2>/dev/null || true
	@docker rm portfolio-dev 2>/dev/null || true
	@echo "✓ Website server stopped"

logs:
	@echo "Showing website logs (Ctrl+C to exit)..."
	docker logs -f portfolio-dev

clean:
	@echo "Cleaning up Docker resources..."
	@docker stop portfolio-dev 2>/dev/null || true
	@docker rm portfolio-dev 2>/dev/null || true
	@docker rmi portfolio:dev 2>/dev/null || true
	@echo "✓ Cleanup complete"

# ============================================================
# MUSINGS BUILD COMMAND
# ============================================================

build-musings:
	@echo "Building musings from markdown (in Docker)..."
	@docker run --rm \
		-v $$(pwd):/build \
		-w /build \
		node:20-alpine \
		sh -c "npm install --silent && npm run build-musings"
	@echo "✓ Musings build complete"

new-musing:
	@if [ -z "$(SLUG)" ]; then \
		echo "Error: Please provide a SLUG parameter"; \
		echo "Usage: make new-musing SLUG=my-post-title"; \
		exit 1; \
	fi
	@DATE=$$(date "+%B %d, %Y"); \
	FILE="musings/content/$(SLUG).md"; \
	if [ -f "$$FILE" ]; then \
		echo "Error: $$FILE already exists"; \
		exit 1; \
	fi; \
	echo "Creating new musing: $$FILE"; \
	echo "---" > "$$FILE"; \
	echo "title: TODO: Add your title here" >> "$$FILE"; \
	echo "date: $$DATE" >> "$$FILE"; \
	echo "description: TODO: Add a compelling description" >> "$$FILE"; \
	echo "slug: $(SLUG)" >> "$$FILE"; \
	echo "---" >> "$$FILE"; \
	echo "" >> "$$FILE"; \
	echo "Write your content here in markdown." >> "$$FILE"; \
	echo "" >> "$$FILE"; \
	echo "## Example Heading" >> "$$FILE"; \
	echo "" >> "$$FILE"; \
	echo "Your thoughts..." >> "$$FILE"; \
	echo ""; \
	echo "✓ Created $$FILE"; \
	echo ""; \
	echo "Next steps:"; \
	echo "  1. Edit the file and add your content"; \
	echo "  2. Run 'make build-musings' to generate HTML"; \
	echo "  3. Add link to index.html"; \
	echo "  4. Test with 'make up'"

# ============================================================
# PRODUCTION DEPLOYMENT (Cloud Run)
# ============================================================

set-gcp-project:
	@echo "Setting GCP project to $(GCP_PROJECT)..."
	gcloud config set project $(GCP_PROJECT)
	@echo "✓ GCP project set"

build-cloud: build-musings
	@echo "Building Docker image for Cloud Run (linux/amd64)..."
	docker buildx build \
		--platform linux/amd64 \
		-t gcr.io/$(GCP_PROJECT)/$(APP_NAME) \
		-f Dockerfile \
		.
	@echo "✓ Cloud Run image built"

push:
	@echo "Pushing image to Google Container Registry..."
	docker push gcr.io/$(GCP_PROJECT)/$(APP_NAME)
	@echo "✓ Image pushed to gcr.io/$(GCP_PROJECT)/$(APP_NAME)"

deploy: set-gcp-project build-cloud push
	@echo "Deploying to Cloud Run..."
	gcloud run deploy $(APP_NAME) \
		--image gcr.io/$(GCP_PROJECT)/$(APP_NAME) \
		--platform managed \
		--region us-central1 \
		--allow-unauthenticated \
		--port 80
	@echo ""
	@echo "✓ Deployment complete!"
	@echo "Your site should be live at the URL shown above"
