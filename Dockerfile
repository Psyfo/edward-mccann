# Multi-stage build for the self-hosted deployment. Next.js `output: standalone`
# means the runtime image carries only the server, its traced dependencies and
# the static assets, rather than the whole node_modules tree.

FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# Dev dependencies are needed at build time (TypeScript, ESLint config).
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Public, non-secret build-time values. Anything prefixed NEXT_PUBLIC_ is
# inlined into the client bundle by `next build`, so it must be present here
# rather than only at runtime.
ARG NEXT_PUBLIC_MEDIA_BASE_URL
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_MEDIA_BASE_URL=$NEXT_PUBLIC_MEDIA_BASE_URL \
    NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# Run unprivileged.
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

# The standalone output ships its own minimal server.
CMD ["node", "server.js"]
