# Based on Vercel's Next.js Dockerfile example
# https://github.com/vercel/next.js/blob/68a71289b3a7eca1fa9865bf49a92590faa9c6c0/examples/with-docker-compose/next-app/prod.Dockerfile

FROM node:20-alpine AS base

FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
# Omit --production flag for TypeScript devDependencies
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i; \
  # Allow install without lockfile, so example works even without Node.js installed locally
  else echo "Warning: Lockfile not found. It is recommended to commit lockfiles to version control." && yarn install; \
  fi

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage. Learn more here: https://nextjs.org/telemetry
ENV NEXT_TELEMETRY_DISABLED=1

# Environment variables must be present at build time
# https://github.com/vercel/next.js/discussions/14030
ARG FAUNA_SECRET
ENV FAUNA_SECRET=${FAUNA_SECRET}
ARG NEXT_PUBLIC_DEPLOYMENT_ENV
ENV NEXT_PUBLIC_DEPLOYMENT_ENV=${NEXT_PUBLIC_DEPLOYMENT_ENV}
ARG NEXT_PUBLIC_CHRONICLER_API
ENV NEXT_PUBLIC_CHRONICLER_API=${NEXT_PUBLIC_CHRONICLER_API}
ARG NEXT_PUBLIC_BLASEBALL_WIKI
ENV NEXT_PUBLIC_BLASEBALL_WIKI=${NEXT_PUBLIC_BLASEBALL_WIKI}
ARG NEXT_PUBLIC_REBLASE
ENV NEXT_PUBLIC_REBLASE=${NEXT_PUBLIC_REBLASE}
ARG NEXT_PUBLIC_BLASEBALL_REFERENCE_API
ENV NEXT_PUBLIC_BLASEBALL_REFERENCE_API=${NEXT_PUBLIC_BLASEBALL_REFERENCE_API}

# Build Next.js based on the preferred package manager
RUN \
  if [ -f yarn.lock ]; then yarn build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then pnpm build; \
  else npm run build; \
  fi

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=builder /app/ ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Environment variables must be redefined at run time
ARG FAUNA_SECRET
ENV FAUNA_SECRET=${FAUNA_SECRET}
ARG NEXT_PUBLIC_DEPLOYMENT_ENV
ENV NEXT_PUBLIC_DEPLOYMENT_ENV=${NEXT_PUBLIC_DEPLOYMENT_ENV}
ARG NEXT_PUBLIC_CHRONICLER_API
ENV NEXT_PUBLIC_CHRONICLER_API=${NEXT_PUBLIC_CHRONICLER_API}
ARG NEXT_PUBLIC_BLASEBALL_WIKI
ENV NEXT_PUBLIC_BLASEBALL_WIKI=${NEXT_PUBLIC_BLASEBALL_WIKI}
ARG NEXT_PUBLIC_REBLASE
ENV NEXT_PUBLIC_REBLASE=${NEXT_PUBLIC_REBLASE}
ARG NEXT_PUBLIC_BLASEBALL_REFERENCE_API
ENV NEXT_PUBLIC_BLASEBALL_REFERENCE_API=${NEXT_PUBLIC_BLASEBALL_REFERENCE_API}

# Next.js collects completely anonymous telemetry data about general usage. Learn more here: https://nextjs.org/telemetry
ENV NEXT_TELEMETRY_DISABLED=1

# Note: Don't expose ports here, Compose will handle that for us
CMD ["node", "server.js"]
