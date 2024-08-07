import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RpcValidationError, QueueNames, getRMQOptions, setupAsyncApi } from '@app/common';
import { AuthServiceModule } from './auth-service.module';
import { ConfigPropertyNames } from './config-auth-service.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthServiceModule);

  const config = app.get(ConfigService);
  const port: number = config.getOrThrow(ConfigPropertyNames.PORT);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) =>
        new RpcValidationError(RpcValidationError.flattenAndConvertValidationErrors(errors)),
    }),
  );

  app.connectMicroservice(
    getRMQOptions({
      urls: [config.getOrThrow(ConfigPropertyNames.RABBITMQ_AUTH_SERVICE_URI)],
      queue: QueueNames.AUTH_SERVICE_RPC,
    }),
    {
      inheritAppConfig: true,
    },
  );

  await setupAsyncApi(app, {
    title: 'Auth Service',
    serverName: 'localhost',
    url: config.getOrThrow(ConfigPropertyNames.RABBITMQ_AUTH_SERVICE_URI),
  });

  await app.init(); // ensures that application is fully initialized before starts listening for messages from microservices
  await app.startAllMicroservices();
  await app.listen(port);

  Logger.log(`🚀Auth Service is running on: http://localhost:${port}/, asyncapi: http://localhost:${port}/api/docs`);
  // logger.info(`🚀Auth Service is running on: http://localhost:${port}/, asyncapi: http://localhost:${port}/api/docs`);
}

bootstrap().catch((err) => {
  Logger.error('Error during application bootstrap', err);
});
