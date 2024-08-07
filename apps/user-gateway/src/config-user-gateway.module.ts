import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
// import { LoggerConfigPropertyNames } from '@app/common';
export enum ConfigPropertyNames {
  RABBITMQ_AUTH_SERVICE_URI = 'RABBITMQ_AUTH_SERVICE_URI',
  RABBITMQ_DATA_PROVIDER_SERVICE_URI = 'RABBITMQ_DATA_PROVIDER_SERVICE_URI',
  PORT = 'PORT',
  API_PREFIX = 'API_PREFIX',
  SWAGGER_PASSWORD = 'SWAGGER_PASSWORD',
}

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: './apps/user-gateway/.env',
      validationSchema: Joi.object({
        [ConfigPropertyNames.RABBITMQ_AUTH_SERVICE_URI]: Joi.string().required(),
        [ConfigPropertyNames.PORT]: Joi.number().default(3000),
        // [LoggerConfigPropertyNames.LOG_DESTINATION]: Joi.string().default('user-gateway-logs'),
        [ConfigPropertyNames.API_PREFIX]: Joi.string().default('api/v1'),
        [ConfigPropertyNames.SWAGGER_PASSWORD]: Joi.string().default('admin'),
      }),
      isGlobal: true,
      validationOptions: {
        abortEarly: true,
      },
    }),
  ],
})
export class ConfigUserGatewayModule {}
