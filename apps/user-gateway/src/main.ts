import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { setupSwagger } from '@app/common';
import { UserGatewayModule } from './user-gateway.module';
import { ConfigPropertyNames } from './config-user-gateway.module';

// import { WinstonModule } from 'nest-winston';
// import * as winston from 'winston';

async function bootstrap() {
  const app = await NestFactory.create(UserGatewayModule, {
    // logger: WinstonModule.createLogger({
    //   transports: [
    //     new winston.transports.Console({
    //       format: winston.format.combine(
    //         winston.format.timestamp(),
    //         winston.format.ms(),
    //         winston.format.colorize(),
    //         winston.format.printf(({ timestamp, level, message }) => {
    //           return `${timestamp} [${level}]: ${message}`;
    //         }),
    //       ),
    //     }),
    //     new winston.transports.File({
    //       filename: 'logs/combined.log',
    //       format: winston.format.combine(
    //         winston.format.timestamp(),
    //         winston.format.json(),
    //       ),
    //     }),
    //   ],
    // }),
  });

  const config: ConfigService = app.get(ConfigService);
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
