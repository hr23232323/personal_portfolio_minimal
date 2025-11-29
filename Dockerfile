# Personal Portfolio - Caddy Web Server
# Modern, lightweight static file server with automatic HTTPS support
# Perfect for serving the personal portfolio website

FROM caddy:latest

# Copy entire project to Caddy's default serving directory
COPY . /srv

# Copy Caddyfile to Caddy's config directory
COPY Caddyfile /etc/caddy/Caddyfile

# Expose the standard HTTP port
EXPOSE 80

# Health check to verify server is running
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:80 || exit 1

# Start Caddy with the Caddyfile configuration
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile"]
