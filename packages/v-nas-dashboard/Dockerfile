ARG BASE_PATH=/dashboard

# Base image setup
FROM node:lts-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app
COPY package.json pnpm-lock.yaml /app/

# Dependencies for production, caching pnpm store
FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

# Building the application, caching pnpm store and adding source code
FROM base AS build
ARG BASE_PATH
ENV NEXT_PUBLIC_BASE_PATH=$BASE_PATH

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY . /app
RUN pnpm run build

# Final production image
FROM node:lts-slim AS final
ARG BASE_PATH
ENV NEXT_PUBLIC_BASE_PATH=$BASE_PATH

RUN npm install -g pnpm
WORKDIR /app
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/.next /app/.next
COPY --from=build /app/public /app/public
COPY --from=build /app/next.config.mjs /app/next.config.mjs
COPY --from=build /app/package.json /app/package.json
EXPOSE 4321
CMD ["pnpm", "prod"]
