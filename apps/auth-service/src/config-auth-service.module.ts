import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';

export enum ConfigPropertyNames {
  RABBITMQ_AUTH_SERVICE_URI = 'RABBITMQ_AUTH_SERVICE_URI',
  RABBITMQ_DATA_PROVIDER_SERVICE_URI = 'RABBITMQ_DATA_PROVIDER_SERVICE_URI',
  JWT_SECRET = 'JWT_SECRET',
  LOG_DESTINATION = 'LOG_DESTINATION',
  BCRYPT_SALT_ROUNDS = 'BCRYPT_SALT_ROUNDS',
  JWT_EXPIRATION_SEC = 'JWT_EXPIRATION_SEC',
  MAX_LOGIN_ATTEMPTS = 'MAX_LOGIN_ATTEMPTS',
  LOGIN_LOCKOUT_TIME_MIN = 'LOGIN_LOCKOUT_TIME_MIN',
  SWAGGER_PASSWORD = 'SWAGGER_PASSWORD',
  PORT = 'PORT',
}

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: './apps/auth-service/.env',
      validationSchema: Joi.object({
        [ConfigPropertyNames.PORT]: Joi.number().default(3003),
        [ConfigPropertyNames.RABBITMQ_AUTH_SERVICE_URI]: Joi.string().required(),
        [ConfigPropertyNames.RABBITMQ_DATA_PROVIDER_SERVICE_URI]: Joi.string().required(),
        [ConfigPropertyNames.JWT_SECRET]: Joi.string().required(),
        [ConfigPropertyNames.LOG_DESTINATION]: Joi.string().default('auth-service-logs'),
        [ConfigPropertyNames.BCRYPT_SALT_ROUNDS]: Joi.number().default(10),
        [ConfigPropertyNames.JWT_EXPIRATION_SEC]: Joi.number().default(14 * 24 * 60 * 60),
        [ConfigPropertyNames.MAX_LOGIN_ATTEMPTS]: Joi.number().default(3),
        [ConfigPropertyNames.LOGIN_LOCKOUT_TIME_MIN]: Joi.number().default(2),
        [ConfigPropertyNames.SWAGGER_PASSWORD]: Joi.string().default('admin'),
      }),
      isGlobal: true,
      validationOptions: {
        abortEarly: true,
      },
    }),
  ],
})
export class ConfigAuthServiceModule {}
