import { Module } from '@nestjs/common';
import { ConfigDataProviderServiceModule } from './config-data-provider-service.module';
import { DatabaseModule } from './infrastructure/database.module';
import { UserAccountModule } from './user-account/user-account.module';
import { SteamAccountModule } from './steam-account/steam-account.module';
import { LoginAttemptsModule } from './login-attempts/login-attempts.module';
import { ProxyModule } from './proxy/proxy.module';

@Module({
  imports: [
    ConfigDataProviderServiceModule,
    DatabaseModule,
    UserAccountModule,
    LoginAttemptsModule,
    SteamAccountModule,
    ProxyModule,
  ],
})
export class DataProviderModule {}
