import { Module } from '@nestjs/common';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { LoginAttempt, LoginAttemptSchema } from '../schemas';

import { LoginAttemptsController } from './login-attempts.controller';
import { Model } from 'mongoose';
import { EntityRepository } from '../infrastructure/entity.repository';
import { LoginAttemptsService } from './login-attempts.service';
import { IocTypes } from '../infrastructure/ioc.types';
import { ConfigDBConnectionNames } from '../config-data-provider-service.module';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: LoginAttempt.name,
          schema: LoginAttemptSchema,
        },
      ],
      ConfigDBConnectionNames.PROJECT_X,
    ),
  ],
  controllers: [LoginAttemptsController],
  providers: [
    LoginAttemptsService,
    {
      provide: IocTypes.LoginAttemptsRepository,
      useFactory: (model: Model<LoginAttempt>) => new EntityRepository<LoginAttempt>(model),
      inject: [getModelToken(LoginAttempt.name, ConfigDBConnectionNames.PROJECT_X)],
    },
  ],
})
export class LoginAttemptsModule {}
