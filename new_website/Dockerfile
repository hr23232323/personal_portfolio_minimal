# Personal Portfolio (New) - Caddy Web Server
# Serves the new minimal portfolio design

FROM caddy:latest

# Copy new website to serving directory
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
