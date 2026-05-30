FROM node:22-bookworm-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    git \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/baileys-cjs ./packages/baileys-cjs
RUN npm ci --omit=dev

COPY . .

RUN chown -R node:node /app

ENV NODE_ENV=production

USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=120s --retries=3 \
  CMD node -e "const e=process.env.ENABLE_HEALTH_CHECK==='true';if(!e)process.exit(0);const p=+(process.env.HEALTH_PORT||process.env.PORT||3000);require('http').get('http://127.0.0.1:'+p,r=>process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))"

CMD ["node", "bot.js"]
