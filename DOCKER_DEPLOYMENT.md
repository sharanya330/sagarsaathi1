# Docker Deployment Guide for SagarSaathi

This guide covers deploying the SagarSaathi application using Docker and Docker Compose.

## Prerequisites

- Docker Engine 20.10+ installed
- Docker Compose 2.0+ installed
- At least 2GB of free disk space

## Quick Start (Local Development)

1. **Clone and navigate to the project**
   ```bash
   cd /Users/sharanya/Desktop/sagarsaathi
   ```

2. **Set up environment variables**
   ```bash
   # Copy example files
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   
   # Edit backend/.env and set your values
   # At minimum, update JWT_SECRET for security
   ```

3. **Start all services**
   ```bash
   docker-compose up --build
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - MongoDB: localhost:27017

## Environment Variables

### Backend (.env)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `MONGODB_URI` | Yes | - | MongoDB connection string |
| `PORT` | No | 5001 | Backend server port |
| `NODE_ENV` | No | development | Environment mode |
| `JWT_SECRET` | Yes | - | Secret key for JWT tokens (change in production!) |
| `TWILIO_ACCOUNT_SID` | No | - | Twilio account SID for SMS |
| `TWILIO_AUTH_TOKEN` | No | - | Twilio auth token |
| `TWILIO_PHONE_NUMBER` | No | - | Twilio phone number |

**Important:** The backend now supports multiple MongoDB environment variable names:
- `MONGODB_URI` (recommended)
- `MONGO_URI` (legacy)
- `DATABASE_URL` (alternative)

### Frontend (.env)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | No | http://localhost:5001 | Backend API URL |
| `NEXT_PUBLIC_SOCKET_URL` | No | http://localhost:5001 | Socket.io server URL |

## Docker Commands Reference

### Development

```bash
# Start all services
docker-compose up

# Start in detached mode (background)
docker-compose up -d

# Rebuild and start
docker-compose up --build

# Stop all services
docker-compose down

# Stop and remove volumes (deletes database data!)
docker-compose down -v

# View logs
docker-compose logs

# View logs for specific service
docker-compose logs backend
docker-compose logs frontend

# Follow logs in real-time
docker-compose logs -f

# Execute command in running container
docker-compose exec backend sh
docker-compose exec frontend sh

# Restart a specific service
docker-compose restart backend
```

### Production

```bash
# Start production services
docker-compose -f docker-compose.prod.yml up -d

# View production logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop production services
docker-compose -f docker-compose.prod.yml down
```

## Production Deployment

### Option 1: Using Docker Compose on a VPS

1. **Set up your server**
   - Install Docker and Docker Compose
   - Clone your repository
   - Set up a reverse proxy (nginx/traefik) for HTTPS

2. **Configure environment variables**
   ```bash
   # Create production .env file
   nano .env.production
   ```
   
   Add:
   ```env
   MONGODB_URI=mongodb://mongodb:27017/sagarsaathi
   JWT_SECRET=your_very_secure_random_secret_here
   NEXT_PUBLIC_API_URL=https://api.yourdomain.com
   NEXT_PUBLIC_SOCKET_URL=https://api.yourdomain.com
   ```

3. **Deploy**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

### Option 2: Using Docker on Cloud Platforms

#### AWS ECS / Azure Container Instances / Google Cloud Run

1. **Build and push images**
   ```bash
   # Build images
   docker build -t sagarsaathi-backend:latest ./backend
   docker build -t sagarsaathi-frontend:latest ./frontend
   
   # Tag for your registry
   docker tag sagarsaathi-backend:latest your-registry/sagarsaathi-backend:latest
   docker tag sagarsaathi-frontend:latest your-registry/sagarsaathi-frontend:latest
   
   # Push to registry
   docker push your-registry/sagarsaathi-backend:latest
   docker push your-registry/sagarsaathi-frontend:latest
   ```

2. **Deploy using platform-specific tools**
   - Configure environment variables in the platform dashboard
   - Set up MongoDB (use managed service like MongoDB Atlas)
   - Deploy containers from your registry

## Health Checks

All services include health checks:

- **Backend**: HTTP GET to `http://localhost:5000/`
- **Frontend**: HTTP GET to `http://localhost:3000/`
- **MongoDB**: mongosh ping command

Check service health:
```bash
docker-compose ps
```

## Troubleshooting

### Services won't start

```bash
# Check logs
docker-compose logs

# Check specific service
docker-compose logs backend

# Verify environment variables
docker-compose config
```

### MongoDB connection issues

```bash
# Check MongoDB is running
docker-compose ps mongodb

# Check MongoDB logs
docker-compose logs mongodb

# Verify connection string
docker-compose exec backend env | grep MONGODB_URI
```

### Port conflicts

If ports 3000, 5000, or 27017 are already in use:

1. Stop conflicting services
2. Or modify ports in `docker-compose.yml`:
   ```yaml
   ports:
     - "3001:3000"  # Use port 3001 instead
   ```

### Frontend can't connect to backend

1. Verify backend is running: `docker-compose ps`
2. Check backend logs: `docker-compose logs backend`
3. Verify `NEXT_PUBLIC_API_URL` in frontend/.env
4. For production, ensure URLs use your domain, not localhost

### Rebuilding after code changes

```bash
# Rebuild specific service
docker-compose up --build backend

# Rebuild all services
docker-compose up --build

# Force rebuild without cache
docker-compose build --no-cache
```

## Data Persistence

MongoDB data is stored in a Docker volume named `mongodb_data`. This persists across container restarts.

To backup:
```bash
# Export database
docker-compose exec mongodb mongodump --out=/data/backup

# Copy backup to host
docker cp sagarsaathi-mongodb:/data/backup ./mongodb-backup
```

To restore:
```bash
# Copy backup to container
docker cp ./mongodb-backup sagarsaathi-mongodb:/data/restore

# Restore database
docker-compose exec mongodb mongorestore /data/restore
```

## Security Best Practices

1. **Change default secrets**
   - Generate strong `JWT_SECRET`: `openssl rand -base64 32`
   - Never commit `.env` files to git

2. **Use HTTPS in production**
   - Set up SSL/TLS certificates
   - Use a reverse proxy (nginx, traefik)

3. **Limit exposed ports**
   - Don't expose MongoDB port (27017) in production
   - Use internal Docker networks

4. **Keep images updated**
   ```bash
   docker-compose pull
   docker-compose up -d
   ```

5. **Use managed MongoDB**
   - For production, consider MongoDB Atlas or similar
   - Update `MONGODB_URI` to point to managed service

## Performance Optimization

1. **Use multi-stage builds** (already implemented in Dockerfiles)
2. **Minimize image size** (using Alpine Linux base images)
3. **Enable caching** for faster rebuilds
4. **Use .dockerignore** to exclude unnecessary files

## Monitoring

Monitor container resources:
```bash
# View resource usage
docker stats

# View specific container
docker stats sagarsaathi-backend
```

## Stopping and Cleanup

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: deletes data!)
docker-compose down -v

# Remove unused images
docker image prune -a

# Complete cleanup (WARNING: removes everything!)
docker system prune -a --volumes
```

## Next Steps

- Set up CI/CD pipeline for automated deployments
- Configure monitoring and logging (e.g., Prometheus, Grafana)
- Set up automated backups
- Implement rate limiting and security headers
- Configure CDN for static assets
