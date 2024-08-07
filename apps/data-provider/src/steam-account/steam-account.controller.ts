import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { LoggerService, RoutingKeys, RoutingKeysEntities, SteamAccountRoutingKeys } from '@app/common';
import { SteamAccountService } from './steam-account.service';
import {
  SteamAccount,
  SteamAccountFindByRangeRequest,
  SteamAccountFindByRangeResponse,
  SteamAccountFindRequest,
  SteamAccountFindResponse,
  SteamAccountGetCountRequest,
  SteamAccountUpdateRequest,
  SteamAccountUpdateResponse,
} from '../schemas/steam-account.schema';
import { AttachProxyRequest } from '@app/common/dto/attach.proxy';

@Controller('account-steam')
export class SteamAccountController {
  constructor(
    private readonly logger: LoggerService,
    private readonly steamAccountService: SteamAccountService,
  ) {}

  @MessagePattern({ cmd: RoutingKeys.Find, entity: RoutingKeysEntities.SteamAccount })
  async handleFind(filterQuery: SteamAccountFindRequest): Promise<SteamAccountFindResponse> {
    this.logger?.info(`Find steam user with query ${Object.values(filterQuery).join(';')}`);
    const steamUsersResult = await this.steamAccountService.findSteamUsers(filterQuery);
    return steamUsersResult;
  }

  @MessagePattern({ cmd: RoutingKeys.FindAll, entity: RoutingKeysEntities.SteamAccount })
  async handleFindAll(): Promise<SteamAccountFindResponse> {
    this.logger?.info(`Find all steam users `);
    const steamUsersResult = await this.steamAccountService.findAllSteamUsers();
    return steamUsersResult;
  }

  @MessagePattern({ cmd: RoutingKeys.Update, entity: RoutingKeysEntities.SteamAccount })
  async handleUpdateUser({ id, ...query }: SteamAccountUpdateRequest): Promise<SteamAccountUpdateResponse> {
    this.logger?.info(`Update user with id ${id} and query ${Object.values(query).join(';')}`);
    const steamUserResult = await this.steamAccountService.updateSteamUser(id, query);
    return steamUserResult;
  }

  @MessagePattern({ cmd: RoutingKeys.FindById, entity: RoutingKeysEntities.SteamAccount })
  async handleFindUserById(id: string): Promise<SteamAccount | null> {
    this.logger?.info(`Find steam user by id ${id}`);
    const steamUserResult = await this.steamAccountService.findSteamUserById(id);
    return steamUserResult;
  }

  @MessagePattern({ cmd: RoutingKeys.FindByRange, entity: RoutingKeysEntities.SteamAccount })
  async handleFindByRangeUser({
    limit,
    offset,
    filter = {},
    sortOptions,
  }: SteamAccountFindByRangeRequest): Promise<SteamAccountFindByRangeResponse> {
    this?.logger.info(
      `Find steam users by range limit - ${limit} offset - ${offset}, filter - ${Object.values(filter).join(';')}`,
    );
    const steamUsers = await this.steamAccountService.findSteamUserByRange(limit, offset, filter, sortOptions);
    return steamUsers;
  }

  @MessagePattern({ cmd: SteamAccountRoutingKeys.AttachProxy, entity: RoutingKeysEntities.SteamAccount })
  async attachReservedProxy({ steamAccountId, proxyId }: AttachProxyRequest): Promise<any> {
    this?.logger.info(`Attach reserved proxy (${proxyId}) to SteamAccount by id: ${steamAccountId}`);
    const steamUser = await this.steamAccountService.attachRerservedProxy(steamAccountId, proxyId);
    if (steamUser) {
      await this.steamAccountService.updateSteamUser(steamAccountId, steamUser);
    }
    return steamUser;
  }

  @MessagePattern({ cmd: SteamAccountRoutingKeys.SetupDefaultProxy, entity: RoutingKeysEntities.SteamAccount })
  async setupDefaultProxy({ steamAccountId, proxyId }: AttachProxyRequest): Promise<any> {
    this?.logger.info(`Attach default proxy(${proxyId}) to SteamAccount by id: ${steamAccountId} `);
    const steamUser = await this.steamAccountService.setupDefaultProxy(steamAccountId, proxyId);
    if (steamUser) {
      await this.steamAccountService.updateSteamUser(steamAccountId, steamUser);
    }
    return steamUser;
  }

  @MessagePattern({ cmd: SteamAccountRoutingKeys.RemoveProxies, entity: RoutingKeysEntities.SteamAccount })
  async handleDeleteProxyFromSteamAccount(proxyId: string) {
    this?.logger?.info(`Remove proxy by id ${proxyId} from all SteamAccounts`);
    const result = await this.steamAccountService.removeProxy(proxyId);
    return { isDeleted: result };
  }

  @MessagePattern({ cmd: SteamAccountRoutingKeys.DeattachProxy, entity: RoutingKeysEntities.SteamAccount })
  async handleDeattachProxy({ steamAccountId, proxyId }: AttachProxyRequest) {
    this?.logger.info(`Deattach proxy (${proxyId}) to SteamAccount by id: ${steamAccountId}`);
    const result = await this.steamAccountService.deattachProxy(steamAccountId, proxyId);
    return { isSuccess: result };
  }

  @MessagePattern({ cmd: RoutingKeys.GetCount, entity: RoutingKeysEntities.SteamAccount })
  async handleGetCount(query?: SteamAccountGetCountRequest): Promise<number> {
    this?.logger.info(`Get documents count by filterQuery: ${query && Object.values(query).join(';')}`);
    const count = await this.steamAccountService.getCount(query);
    return count;
  }
}
