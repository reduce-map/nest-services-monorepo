import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigPropertyNames } from '../config-data-provider-service.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow(ConfigPropertyNames.MONGODB_URI),
        authSource: configService.getOrThrow(ConfigPropertyNames.DB_AUTH_SOURCE),
        tls: configService.getOrThrow(ConfigPropertyNames.MONGODB_IS_TSL_ENABLED),
        dbName: configService.getOrThrow(ConfigPropertyNames.DB_PROJECT_X_NAME),
        autoIndex: true,
        retryAttempts: 1,
      }),
      connectionName: 'projectXConnection',
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow(ConfigPropertyNames.MONGODB_URI),
        authSource: configService.getOrThrow(ConfigPropertyNames.DB_AUTH_SOURCE),
        tls: configService.getOrThrow(ConfigPropertyNames.MONGODB_IS_TSL_ENABLED),
        dbName: configService.getOrThrow(ConfigPropertyNames.DB_STEAM_CREDENTIALS_NAME),
        autoIndex: true,
        retryAttempts: 1,
      }),
      connectionName: 'steam_credentialsConnection',
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
