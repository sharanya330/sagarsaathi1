# backend/Dockerfile (Express)
FROM node:20-alpine AS deps
WORKDIR /usr/src/app
COPY backend/package*.json ./
RUN npm install --omit=dev

FROM node:20-alpine AS release
WORKDIR /usr/src/app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY backend/ ./
ENV NODE_ENV=production
ENV PORT=5000
USER appuser
EXPOSE 5000
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:5000/health || exit 1
CMD [ "node", "server.js" ]
