import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import {
  RoutingKeys,
  RoutingKeysEntities,
  UserAccountDto,
  UserAccountPartialDto,
  UserAccountUpdateMsgRequest,
} from '@app/common';
import { UserAccountService } from './user-account.service';
import { AsyncApiPub, AsyncApiSub } from 'nestjs-asyncapi';

@Controller('account-user')
export class UserAccountController {
  private readonly logger = new Logger(UserAccountController.name);

  constructor(private readonly userAccountService: UserAccountService) {}

  @AsyncApiSub({
    channel: `${RoutingKeys.Find}${RoutingKeysEntities.UserAccount}`,
    message: {
      payload: UserAccountDto,
    },
  })
  @AsyncApiPub({
    channel: `${RoutingKeys.Find}${RoutingKeysEntities.UserAccount}`,
    message: {
      payload: UserAccountDto,
    },
  })
  @MessagePattern({ cmd: RoutingKeys.Find, entity: RoutingKeysEntities.UserAccount })
  async handleFindUser(query: UserAccountPartialDto): Promise<UserAccountDto | null> {
    this.logger.log(`Find user with query ${Object.values(query).join(';')}`);
    const userResult = await this.userAccountService.findUser(query);
    return userResult;
  }

  @AsyncApiSub({
    channel: `${RoutingKeys.FindAll}${RoutingKeysEntities.UserAccount}`,
    message: {
      payload: Object,
    },
  })
  @AsyncApiPub({
    channel: `${RoutingKeys.FindAll}${RoutingKeysEntities.UserAccount}`,
    message: {
      payload: UserAccountDto,
    },
  })
  @MessagePattern({ cmd: RoutingKeys.FindAll, entity: RoutingKeysEntities.UserAccount })
  async handleFindAllUsers(): Promise<UserAccountDto[]> {
    this.logger.log(`Find all users with`);
    const usersResult = await this.userAccountService.findAllUsers();
    return usersResult;
  }

  @AsyncApiSub({
    channel: `${RoutingKeys.Update}${RoutingKeysEntities.UserAccount}`,
    message: {
      payload: UserAccountUpdateMsgRequest,
    },
  })
  @AsyncApiPub({
    channel: `${RoutingKeys.Update}${RoutingKeysEntities.UserAccount}`,
    message: {
      payload: UserAccountDto,
    },
  })
  @MessagePattern({ cmd: RoutingKeys.Update, entity: RoutingKeysEntities.UserAccount })
  async handleUpdateUser({ _id, ...entity }: UserAccountUpdateMsgRequest): Promise<UserAccountDto | null> {
    this.logger.log(`Update user with id ${_id}`);
    const userResult = await this.userAccountService.updateUser(_id, entity);
    return userResult;
  }
}
