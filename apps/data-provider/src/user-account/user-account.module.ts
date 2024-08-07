import { Module } from '@nestjs/common';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UserAccountService } from './user-account.service';
import { UserAccountController } from './user-account.controller';
import { UserAccount, UserAccountSchema } from '../schemas';
import { EntityRepository } from '../infrastructure/entity.repository';
import { IocTypes } from '../infrastructure/ioc.types';
import { ConfigDBConnectionNames } from '../config-data-provider-service.module';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: UserAccount.name,
          schema: UserAccountSchema,
        },
      ],
      ConfigDBConnectionNames.PROJECT_X,
    ),
  ],
  controllers: [UserAccountController],
  providers: [
    {
      provide: IocTypes.UserAccountRepository,
      useFactory: (model: Model<UserAccount>) => new EntityRepository<UserAccount>(model),
      inject: [getModelToken(UserAccount.name, ConfigDBConnectionNames.PROJECT_X)],
    },
    UserAccountService,
  ],
})
export class UserAccountModule {}
