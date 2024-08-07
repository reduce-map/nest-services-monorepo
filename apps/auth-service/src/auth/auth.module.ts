import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleAsyncOptions } from '@nestjs/jwt';
import { DITokenNames, QueueNames, CustomRMQClientProxy, getConnectedRmqClient } from '@app/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { ConfigPropertyNames } from '../config-auth-service.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.getOrThrow(ConfigPropertyNames.JWT_SECRET),
        signOptions: { expiresIn: Number(configService.getOrThrow(ConfigPropertyNames.JWT_EXPIRATION_SEC)) },
      }),
      inject: [ConfigService],
    } as JwtModuleAsyncOptions),
  ],
  providers: [
    AuthService,
    UserService,
    {
      provide: DITokenNames.ACCOUNT_USER_SERVICE,
      useFactory: (configService: ConfigService): Promise<CustomRMQClientProxy> => {
        return getConnectedRmqClient({
          urls: [configService.getOrThrow(ConfigPropertyNames.RABBITMQ_DATA_PROVIDER_SERVICE_URI) as string],
          queue: QueueNames.ACCOUNT_USER_SERVICE_RPC,
        });
      },
      inject: [ConfigService],
    },
    {
      provide: DITokenNames.LOGIN_ATTEMPTS_SERVICE,
      useFactory: async (configService: ConfigService): Promise<CustomRMQClientProxy> => {
        return getConnectedRmqClient({
          urls: [configService.getOrThrow(ConfigPropertyNames.RABBITMQ_DATA_PROVIDER_SERVICE_URI) as string],
          queue: QueueNames.LOGIN_ATTEMPTS_SERVICE_RPC,
        });
      },
      inject: [ConfigService],
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
