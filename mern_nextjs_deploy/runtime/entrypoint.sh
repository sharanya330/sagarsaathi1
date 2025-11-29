#!/bin/sh
# Simple runtime env injection for Next.js public runtime config.
# Usage: COPY this into frontend image and set as ENTRYPOINT to inject /usr/share/nginx/html/runtime-config.json
set -e
# Create runtime config from env vars
cat > /app/public/runtime-config.json <<EOF
{
  "NEXT_PUBLIC_API_URL": "${NEXT_PUBLIC_API_URL:-/api}"
}
EOF
# Start the original command
exec "$@"
