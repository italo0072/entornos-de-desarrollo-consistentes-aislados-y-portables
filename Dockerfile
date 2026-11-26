FROM node:24-alpine AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

FROM base AS dependencias
COPY package.json package-lock.json ./
ARG NPM_CONFIG_REGISTRY=https://registry.npmjs.org/
RUN npm ci --no-audit --no-fund

FROM dependencias AS compilacion
COPY . .
RUN npm run build && npm prune --omit=dev --offline --no-audit --no-fund

FROM base AS produccion
ENV NODE_ENV=production
ENV PORT=3000
COPY --from=compilacion /app/package.json ./
COPY --from=compilacion /app/node_modules ./node_modules
COPY --from=compilacion --chown=node:node /app/.next ./.next
USER node
EXPOSE 3000
CMD ["node", "node_modules/next/dist/bin/next", "start", "--hostname", "0.0.0.0"]
