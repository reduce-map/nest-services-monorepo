import { Inject, Injectable } from '@nestjs/common';
import { UserAccountDto, UserAccountPartialDto } from '@app/common';
import { EntityRepository } from '../infrastructure/entity.repository';
import { IocTypes } from '../infrastructure/ioc.types';
import { buildQueryFromDTO, QueryType } from '../infrastructure/utils';

@Injectable()
export class UserAccountService {
  constructor(
    @Inject(IocTypes.UserAccountRepository)
    private readonly userAccountRepository: EntityRepository<UserAccountDto>,
  ) {}

  findUser(dto: UserAccountPartialDto): Promise<UserAccountDto | null> {
    const query = buildQueryFromDTO(dto, QueryType.FILTER);
    return this.userAccountRepository.find(query);
  }

  findAllUsers(): Promise<UserAccountDto[]> {
    return this.userAccountRepository.findMany({});
  }

  updateUser(userId: string, entity: UserAccountPartialDto): Promise<UserAccountDto | null> {
    return this.userAccountRepository.update(userId, entity);
  }
}
