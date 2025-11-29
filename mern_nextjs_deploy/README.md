# MERN + Next.js Docker Deploy (Frontend in `frontend/`, Backend in `backend/`)

## What this bundle contains
- `frontend/Dockerfile`           : Multi-stage Dockerfile for Next.js (SSR)
- `backend/Dockerfile`            : Multi-stage Dockerfile for Express backend
- `nginx/default.conf`            : Nginx reverse-proxy config
- `docker-compose.yml`            : Compose to run mongo, backend, frontend, nginx
- `.env.example`                  : Example env file (DO NOT commit secrets)
- `.github/workflows/ci-cd.yml`   : GitHub Actions workflow (build, push, deploy via SSH)
- `runtime/entrypoint.sh`         : Optional runtime env-injection entrypoint for Next.js
- `runtime/nginx-runtime.conf`    : Nginx snippet to serve runtime config
- `deploy/ssh-deploy.sh`          : Example deploy script for remote server
- `README_RUN_STEPS.txt`          : Step-by-step commands to run locally + troubleshooting
- `LICENSE`                       : MIT

## Concept summary (brief — read full conceptual guide in conversation)
- Build frontend (Next.js) with `npm run build` (produces .next). For SSR, run `next start`.
- Build backend (Express) with production dependencies.
- Create Docker images (multi-stage) for reproducible artifacts.
- Use reverse proxy (nginx/Traefik) to route `/api/*` to backend and else to Next.js.
- Use volumes for MongoDB persistence and avoid baking secrets into images.
- CI/CD: tests → build images → scan → push to registry → deploy (SSH or k8s/GitOps).

## Files are ready to copy into your repo. Use the `docker compose up -d --build` command.
