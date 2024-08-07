import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { setupSwagger } from '@app/common';
import { UserGatewayModule } from './user-gateway.module';
import { ConfigPropertyNames } from './config-user-gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(UserGatewayModule);

  const config: ConfigService = app.get(ConfigService);
  // const logger: LoggerService = app.get(LoggerService);
  const port: number = config.getOrThrow(ConfigPropertyNames.PORT);
  const globalPrefix: string = config.getOrThrow(ConfigPropertyNames.API_PREFIX);

  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  // app.useGlobalInterceptors(new LoggingInterceptor(logger));
  setupSwagger(app, {
    title: 'User Gateway',
  });
  await app.listen(port);

  Logger.log(`
    🚀User-gateway is running on: http://localhost:${port}/${globalPrefix}
    swagger: http://localhost:${port}/${globalPrefix}/docs
  `);
}

bootstrap().catch((err) => {
  Logger.error('Error during application bootstrap', err);
});
