FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma
RUN npm ci

COPY nest-cli.json tsconfig*.json ./
COPY src ./src
RUN npm run prisma:generate && npm run build && npm prune --omit=dev

FROM node:20-alpine AS runner

ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
RUN npm cache clean --force

EXPOSE 3001

CMD ["sh", "-c", "npm run prisma:migrate:deploy && npm run start:prod"]
