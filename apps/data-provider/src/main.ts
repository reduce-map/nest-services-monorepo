import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  getRMQOptions,
  setupAsyncApi,
  QueueNames,
  RpcValidationError,
} from '@app/common';
import { DataProviderModule } from './data-provider.module';
import { ConfigPropertyNames } from './config-data-provider-service.module';

async function bootstrap() {
  const app = await NestFactory.create(DataProviderModule);

  const config: ConfigService = app.get(ConfigService);
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

  [
    QueueNames.ACCOUNT_USER_SERVICE_RPC,
    QueueNames.LOGIN_ATTEMPTS_SERVICE_RPC,
    QueueNames.ACCOUNT_STEAM_SERVICE_RPC,
    QueueNames.PROXY_SERVICE_RPC,
  ].forEach((queueName) => {
    app.connectMicroservice(
      getRMQOptions({
        urls: [config.getOrThrow(ConfigPropertyNames.RABBITMQ_DATA_PROVIDER_SERVICE_URI)],
        queue: queueName,
      }),
      {
        inheritAppConfig: true,
      },
    );
  });

  await setupAsyncApi(app, {
    title: 'Data Provider Service',
    serverName: 'localhost',
    url: config.getOrThrow(ConfigPropertyNames.RABBITMQ_DATA_PROVIDER_SERVICE_URI),
  });

  await app.init(); // ensures that application is fully initialized before starts listening for messages from microservices
  await app.startAllMicroservices();
  await app.listen(port);

  Logger.log(
    `🚀Data Provider Service is running on: http://localhost:${port}/, asyncapi: http://localhost:${port}/api/docs`,
  );
}
bootstrap().catch((err) => {
  Logger.error('Error during application bootstrap', err);
});
