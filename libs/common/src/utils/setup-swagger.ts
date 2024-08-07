import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as basicAuth from 'express-basic-auth';

export type ConfigSwagger = {
  title: string;
};

export const setupSwagger = (app: INestApplication, configSwagger: ConfigSwagger) => {
  const swaggerPassword = app.get(ConfigService).getOrThrow('SWAGGER_PASSWORD');

  /**
   * Sets up password-protected swagger documentation for the application
   */
  app.use(
    ['/api/v1/docs', '/api/v1/docs-json'],
    basicAuth({
      challenge: true,
      users: {
        admin: swaggerPassword,
      },
    }),
  );

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle(configSwagger.title)
    .setDescription(`${configSwagger.title} API Documentation`)
    .setVersion('alpha')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, document, {
    useGlobalPrefix: true,
  });
};
