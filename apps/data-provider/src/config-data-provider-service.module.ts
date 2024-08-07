import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { LoggerConfigPropertyNames } from '@app/common';

export enum ConfigPropertyNames {
  RABBITMQ_DATA_PROVIDER_SERVICE_URI = 'RABBITMQ_DATA_PROVIDER_SERVICE_URI',
  MONGODB_URI = 'MONGODB_URI',
  MONGODB_IS_TSL_ENABLED = 'MONGODB_IS_TSL_ENABLED',
  DB_AUTH_SOURCE = 'DB_AUTH_SOURCE',
  DB_PROJECT_X_NAME = 'DB_PROJECT_X_NAME',
  DB_STEAM_CREDENTIALS_NAME = 'DB_STEAM_CREDENTIALS_NAME',
  SWAGGER_PASSWORD = 'SWAGGER_PASSWORD',
  PORT = 'PORT',
}

export enum ConfigDBConnectionNames {
  PROJECT_X = 'projectXConnection',
  STEAM_CREDENTIALS = 'steam_credentialsConnection',
}

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: './apps/data-provider/.env',
      validationSchema: Joi.object({
        [ConfigPropertyNames.RABBITMQ_DATA_PROVIDER_SERVICE_URI]: Joi.string().required(),
        [ConfigPropertyNames.PORT]: Joi.number().default(3004),
        [ConfigPropertyNames.MONGODB_URI]: Joi.string().required(),
        [ConfigPropertyNames.MONGODB_IS_TSL_ENABLED]: Joi.boolean().default(false),
        [LoggerConfigPropertyNames.LOG_DESTINATION]: Joi.string().default('data-provider-service-logs'),
        [ConfigPropertyNames.DB_AUTH_SOURCE]: Joi.string().default('admin'),
        [ConfigPropertyNames.DB_PROJECT_X_NAME]: Joi.string().default('auth-service'),
        [ConfigPropertyNames.DB_STEAM_CREDENTIALS_NAME]: Joi.string().default('steam_credentials'),
        [ConfigPropertyNames.SWAGGER_PASSWORD]: Joi.string().default('admin'),
      }),
      isGlobal: true,
      validationOptions: {
        abortEarly: true,
      },
    }),
  ],
})
export class ConfigDataProviderServiceModule {}
