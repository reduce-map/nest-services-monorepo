## ===================================> dependencies stage
FROM node:lts-alpine AS dependencies
ENV PUPPETEER_SKIP_DOWNLOAD=true
WORKDIR /usr/src/app
COPY package*.json ./
#RUN if [ "$DOCKER_TARGET" = "development" ] ; then npm i ; else npm ci ; fi && npm rebuild bcrypt && rm -f .npmrc
RUN if [ "$DOCKER_TARGET" = "development" ] ; then npm i ; else npm ci ; fi && npm rebuild bcrypt

## ===================================> base stage
FROM node:lts-alpine AS base
ARG SERVICE_NAME
WORKDIR /usr/src/app
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY . .

## ===================================> development stage
FROM base AS development
CMD echo "Service Name: $SERVICE_NAME" && npm run "dev:$SERVICE_NAME"

## ===================================> build stage
FROM base AS build
RUN npm run build:$SERVICE_NAME

## ===================================> production stage
FROM base AS production
COPY --from=build /usr/src/app/dist/apps/${SERVICE_NAME} ./dist
## Drop privileges uncomment the line below
# USER node
CMD ["node", "dist/main.js"]
