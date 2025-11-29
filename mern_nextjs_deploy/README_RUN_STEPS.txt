Local run steps:

1. Copy these files to your project root so structure looks like:
   - frontend/ (your Next.js app)
   - backend/ (your Express app with server.js)
   - nginx/default.conf
   - docker-compose.yml
   - .env (created from .env.example)

2. Create .env from .env.example and fill values.

3. Build & run:
   docker compose up -d --build

4. Verify:
   curl -I http://localhost/          # should return 200 and HTML
   curl -I http://localhost/api/health

Troubleshooting:
- Check logs: docker compose logs -f frontend
- Rebuild frontend (if NEXT_PUBLIC_* changed): docker compose build frontend
