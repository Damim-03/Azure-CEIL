# ========= BUILD =========
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY prisma.config.ts ./
COPY prisma ./prisma/

RUN npm install
RUN npx prisma generate

COPY src ./src
RUN npm run build

# ========= RUN =========
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/prisma.config.ts ./

EXPOSE 8080

CMD ["node", "dist/app.js"]