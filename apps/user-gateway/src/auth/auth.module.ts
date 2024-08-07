import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DITokenNames, QueueNames, CustomRMQClientProxy, getConnectedRmqClient } from '@app/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigPropertyNames } from '../config-user-gateway.module';

@Module({
  providers: [
    {
      provide: DITokenNames.AUTHENTICATION_SERVICE,
      useFactory: async (configService: ConfigService): Promise<CustomRMQClientProxy> => {
        return getConnectedRmqClient({
          urls: [configService.getOrThrow(ConfigPropertyNames.RABBITMQ_AUTH_SERVICE_URI) as string],
          queue: QueueNames.AUTH_SERVICE_RPC,
        });
      },
      inject: [ConfigService],
    },
    AuthService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
