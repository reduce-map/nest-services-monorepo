import { Module } from '@nestjs/common';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProxyController } from './proxy.controller';
import { ProxyService } from './proxy.service';
import { Proxy, ProxySchema } from '../schemas';
import { EntityRepository } from '../infrastructure/entity.repository';
import { IocTypes } from '../infrastructure/ioc.types';
import { ConfigDBConnectionNames } from '../config-data-provider-service.module';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: Proxy.name,
          schema: ProxySchema,
        },
      ],
      ConfigDBConnectionNames.STEAM_CREDENTIALS,
    ),
  ],
  controllers: [ProxyController],
  providers: [
    ProxyService,
    {
      provide: IocTypes.ProxyRepository,
      useFactory: (model: Model<Proxy>) => new EntityRepository<Proxy>(model),
      inject: [getModelToken(Proxy.name, ConfigDBConnectionNames.STEAM_CREDENTIALS)],
    },
  ],
})
export class ProxyModule {}
