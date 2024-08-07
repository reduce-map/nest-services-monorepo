import { Module } from '@nestjs/common';
// import { LoggerModule } from '@app/common';
import { ConfigAuthServiceModule } from './config-auth-service.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ConfigAuthServiceModule, AuthModule],
})
export class AuthServiceModule {}
