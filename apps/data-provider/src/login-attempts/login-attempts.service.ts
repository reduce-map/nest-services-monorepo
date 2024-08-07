import { Inject, Injectable } from '@nestjs/common';
import { LoginAttemptRequest } from '@app/common';
import { LoginAttempt } from '../schemas';
import { EntityRepository } from '../infrastructure/entity.repository';
import { IocTypes } from '../infrastructure/ioc.types';

@Injectable()
export class LoginAttemptsService {
  constructor(
    @Inject(IocTypes.LoginAttemptsRepository)
    private readonly loginAttemptsRepository: EntityRepository<LoginAttempt>,
  ) {}

  createLoginAttempt(loginAttempt: LoginAttemptRequest): Promise<LoginAttempt> {
    return this.loginAttemptsRepository.create(loginAttempt);
  }
}
