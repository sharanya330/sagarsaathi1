#!/bin/sh
# Simple deploy script to run on server (assumes docker & docker-compose installed)
set -e
cd /home/$USER/app
git pull origin main
docker compose pull
docker compose up -d
