# Dockerfile copied from: https://github.com/Fx64b/video-archiver/tree/main/web/Dockerfile 
FROM node:20-alpine AS deps
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Only copy package.json and pnpm-lock.yaml to prevent cache busting
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

FROM node:20-alpine AS builder
WORKDIR /app

RUN npm install -g pnpm

COPY . .

COPY --from=deps /app/node_modules ./node_modules

# Set environment to production
ENV NODE_ENV production

# Build the application
RUN pnpm build

# Final image to serve the app
FROM node:20-alpine AS runner
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml* ./

RUN pnpm install --frozen-lockfile --prod

COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next

EXPOSE 3000

CMD ["pnpm", "start"]
