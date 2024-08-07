import { Inject, Injectable } from '@nestjs/common';

import { FilterQuery, Types, UpdateQuery } from 'mongoose';
import { EntityRepository } from '../infrastructure/entity.repository';
import { IocTypes } from '../infrastructure/ioc.types';
import { ProxyIdentified, SteamAccount, SteamAccountAttached, SteamAccountIdentified } from '../schemas';

@Injectable()
export class SteamAccountService {
  constructor(
    @Inject(IocTypes.SteamAccountRepository)
    private readonly steamAccountRepository: EntityRepository<SteamAccountIdentified>,
    @Inject(IocTypes.ProxyRepository)
    private readonly proxyRepository: EntityRepository<ProxyIdentified>,
  ) {}

  findSteamUsers(query: FilterQuery<SteamAccount>): Promise<SteamAccount[]> {
    return this.steamAccountRepository.findMany(query, ['attached.defaultProxy']);
  }

  findAllSteamUsers(): Promise<SteamAccount[]> {
    return this.steamAccountRepository.findMany({}, ['attached.defaultProxy']);
  }

  updateSteamUser(userId: string, entity: UpdateQuery<SteamAccount>): Promise<SteamAccount | null> {
    return this.steamAccountRepository.update(userId, entity);
  }

  async findSteamUserByRange(
    limit: number,
    offset: number,
    filterQuery: FilterQuery<SteamAccount>,
    sortOptions?: Record<string, 1 | -1>,
  ): Promise<SteamAccount[]> {
    return this.steamAccountRepository.findByRange(limit, offset, filterQuery, sortOptions, ['attached.defaultProxy']);
  }

  findSteamUserById(id: string): Promise<SteamAccount | null> {
    return this.steamAccountRepository.findById(id, ['attached.defaultProxy']);
  }

  getCount(query?: FilterQuery<SteamAccount>): Promise<number> {
    return this.steamAccountRepository.getCountDocuments(query);
  }

  async removeProxy(proxyId: string): Promise<boolean> {
    try {
      const proxy = await this.proxyRepository.findById(proxyId);
      if (!proxy) {
        return false;
      }
      const accounts = await this.steamAccountRepository.findMany({
        'attached.backupProxies': {
          $elemMatch: { $eq: Types.ObjectId.createFromHexString(proxyId) },
        },
      });

      for (const steamAccount of accounts) {
        this.removeOneProxyFromSteamAccount(steamAccount, proxyId);
        this.removeOneAccountFromProxy(proxy, steamAccount._id);
      }
      return true;
    } catch {
      return false;
    }
  }

  async deattachProxy(steamAccountId: string, proxyId: string): Promise<boolean> {
    const steamAccount = await this.steamAccountRepository.findById(steamAccountId);
    if (!steamAccount) {
      return false;
    }
    await this.removeOneProxyFromSteamAccount(steamAccount, proxyId);
    const proxy = await this.proxyRepository.findById(proxyId);
    if (!proxy) {
      return false;
    }
    await this.removeOneAccountFromProxy(proxy, steamAccountId);
    return true;
  }

  private async removeOneProxyFromSteamAccount(steamAccount: SteamAccountIdentified, proxyId: string) {
    if (steamAccount.attached?.defaultProxy?.toHexString() === proxyId) {
      steamAccount.attached.defaultProxy = undefined;
      await this.steamAccountRepository.update(steamAccount._id, steamAccount);
    }
    const proxyIndex = steamAccount.attached?.backupProxies?.map((x) => x.toHexString()).indexOf(proxyId);
    if (proxyIndex === undefined) {
      return null;
    }
    if (proxyIndex == -1) {
      return null;
    }
    steamAccount?.attached?.backupProxies?.splice(proxyIndex, 1);
    await this.steamAccountRepository.update(steamAccount._id, steamAccount);
  }

  private async removeOneAccountFromProxy(proxy: ProxyIdentified, steamAccountId: string) {
    const steamAccountIndex = proxy.accounts?.map((x) => x.toHexString()).indexOf(steamAccountId);
    if (steamAccountIndex === undefined) {
      return null;
    }
    if (steamAccountIndex == -1) {
      return null;
    }
    proxy?.accounts?.splice(steamAccountIndex, 1);
    await this.proxyRepository.update(proxy._id, proxy);
  }

  async attachRerservedProxy(steamAccountId: string, proxyId: string): Promise<SteamAccount | null> {
    const proxy = await this.proxyRepository.findById(proxyId);
    if (!proxy) {
      return null;
    }
    const steamAccount: SteamAccountIdentified | null = await this.steamAccountRepository.findById(steamAccountId);
    if (!steamAccount) {
      return null;
    }
    if (steamAccount?.attached?.backupProxies?.includes(Types.ObjectId.createFromHexString(proxyId))) {
      return steamAccount;
    }
    if (!steamAccount.attached) {
      steamAccount.attached = new SteamAccountAttached();
    }
    steamAccount.attached.backupProxies?.push(Types.ObjectId.createFromHexString(proxyId));
    proxy.accounts?.push(Types.ObjectId.createFromHexString(steamAccountId));
    this.proxyRepository.update(proxy._id, proxy);
    return steamAccount;
  }

  async setupDefaultProxy(steamAccountId: string, proxyId: string): Promise<SteamAccount | null> {
    const steamAccount = await this.attachRerservedProxy(steamAccountId, proxyId);
    if (!steamAccount) {
      return null;
    }
    steamAccount.attached!.defaultProxy = Types.ObjectId.createFromHexString(proxyId);
    return steamAccount;
  }
}
