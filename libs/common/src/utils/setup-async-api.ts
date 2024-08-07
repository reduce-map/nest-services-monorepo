import { INestApplication } from '@nestjs/common';
import { AsyncApiModule, AsyncApiDocumentBuilder } from 'nestjs-asyncapi';
import * as basicAuth from 'express-basic-auth';
import { ConfigService } from '@nestjs/config';

export type ConfigAsyncApi = {
  title: string;
  url: string;
  serverName: string;
};

export const setupAsyncApi = (app: INestApplication, config: ConfigAsyncApi) => {
  const swaggerPassword = app.get(ConfigService).getOrThrow('SWAGGER_PASSWORD');
  app.use(
    ['/api/docs'],
    basicAuth({
      challenge: true,
      users: {
        admin: swaggerPassword,
      },
    }),
  );

  const asyncApiOptions = new AsyncApiDocumentBuilder()
    .setTitle(config.title)
    .setDescription(`${config.title} service API`)
    .setVersion('0.0.1')
    .setDefaultContentType('application/json')
    .addServer(config.serverName || 'localhost', {
      protocol: 'amqps',
      url: config.url,
    })
    .build();

  const asyncapiDocument = AsyncApiModule.createDocument(app, asyncApiOptions);
  return AsyncApiModule.setup('api/docs', app, asyncapiDocument);
};
