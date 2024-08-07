import { Module } from '@nestjs/common';
// import { LoggerModule } from '@app/common';
import { ConfigUserGatewayModule } from './config-user-gateway.module';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [ConfigUserGatewayModule, AuthModule],
})
export class UserGatewayModule {}
