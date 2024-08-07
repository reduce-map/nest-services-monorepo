# Services Monorepo

This is a monorepo for multiple services built with the NestJS framework <img src="https://nestjs.com/img/logo-small.svg" width="auto" height="20px" alt="Nest Logo" /> .

The monorepo includes **these services**: auth-service, data-provider and user-gateway.

## Installation

After cloning the repository and running `npm install`, the `prepare` script is automatically run. This script sets up [Husky](https://typicode.github.io/husky/#/) git hooks which help ensure consistent code quality and commit message format. See the [Git Hooks](#git-hooks) section for more details.

```bash
$ npm install
```

## Documentation

This project uses [Compodoc](https://compodoc.app/) to generate and serve static documentation for the codebase. Compodoc creates a visual documentation where you can quickly find information about your components, modules, routes, services, and more.

This command will generate a static documentation site in the `documentation/` directory.

### Generating Documentation

To generate the documentation, run the following command:

```bash
$ npm run compodoc
```

## Development mode

```bash
$ npm run dev # concurrently run all services in development mode
$ npm run dev:user-gateway # run user-gateway service in development mode
$ npm run dev:auth-service # run auth-service service in development mode
$ npm run dev:data-provider # run data-provider service in development mode
```

## Building the app

Before starting the application, it's recommended to build it first. This will transpile the TypeScript code into JavaScript, which can then be run directly by Node.js. This step is especially important if you're running the application in a production environment.

```bash
$ npm run build # build all services
$ npm run build:user-gateway # build user-gateway service
$ npm run build:auth-service # build auth-service service
$ npm run build:data-provider # build data-provider service
```

## Docker Compose

You can also run the services using Docker Compose. The following commands are available:

```bash
$ npm run docker-compose:up:prod # run all services in production mode using Docker Compose
$ npm run docker-compose:up:prod:build # build and run all services in production mode using Docker Compose
$ npm run docker-compose:up:dev # run all services in development mode using Docker Compose
$ npm run docker-compose:up:dev:build # build and run all services in development mode using Docker Compose
$ npm run docker-compose:down # stop all services running in Docker Compose
```

## Docker Environment Modes

The development and production modes for Docker are now toggled using the DOCKER_TARGET shell variable. This provides a convenient switch between environments without changing the Docker setup. You can set this variable in your shell or directly in the Docker commands like so:

```bash
$ DOCKER_TARGET=development docker compose up --build
$ DOCKER_TARGET=production docker compose up --build
```

### Service-Specific Environment Variables

Each service within our monorepo now has its dedicated .env.docker file. Please refer to these files for environment variable settings.

### Docker Image Tagging

For dynamic tagging strategy has been implemented that appends the ${DOCKER_TARGET:-production} tag to our images.

## Linting and Formatting

To ensure code quality and consistency, you can run ESLint and Prettier using the following commands:

```bash
$ npm run lint # run ESLint
$ npm run format # run Prettier
```

## Git Hooks

This project uses [Husky](https://typicode.github.io/husky/#/) to manage git hooks. When you commit or push changes, the following actions are triggered:

### pre-commit

Before each commit, the `precommit` script is run. This script triggers [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) to ensure code quality and consistency. If any issues are found that can't be automatically fixed, the commit will be aborted.

### pre-push

Before each push, the test suite is run to ensure that all tests pass. If any tests fail, the push will be aborted.
