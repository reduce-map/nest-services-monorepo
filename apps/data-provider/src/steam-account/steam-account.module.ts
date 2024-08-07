import { Module } from '@nestjs/common';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { SteamAccountController } from './steam-account.controller';
import { SteamAccountService } from './steam-account.service';
import { Model } from 'mongoose';
import { EntityRepository } from '../infrastructure/entity.repository';
import { IocTypes } from '../infrastructure/ioc.types';
import { ConfigDBConnectionNames } from '../config-data-provider-service.module';
import { Proxy, ProxySchema, SteamAccount, SteamAccountSchema } from '../schemas';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: SteamAccount.name,
          schema: SteamAccountSchema,
        },
        {
          name: Proxy.name,
          schema: ProxySchema,
        },
      ],
      ConfigDBConnectionNames.STEAM_CREDENTIALS,
    ),
  ],
  controllers: [SteamAccountController],
  providers: [
    SteamAccountService,
    {
      provide: IocTypes.SteamAccountRepository,
      useFactory: (model: Model<SteamAccount>) => new EntityRepository<SteamAccount>(model),
      inject: [getModelToken(SteamAccount.name, ConfigDBConnectionNames.STEAM_CREDENTIALS)],
    },
    {
      provide: IocTypes.ProxyRepository,
      useFactory: (model: Model<Proxy>) => new EntityRepository<Proxy>(model),
      inject: [getModelToken(Proxy.name, ConfigDBConnectionNames.STEAM_CREDENTIALS)],
    },
  ],
})
export class SteamAccountModule {}
