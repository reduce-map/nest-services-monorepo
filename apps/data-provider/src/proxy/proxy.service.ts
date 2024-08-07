import { Inject, Injectable } from '@nestjs/common';
import { FilterQuery, UpdateQuery } from 'mongoose';
import { EntityRepository } from '../infrastructure/entity.repository';
import { IocTypes } from '../infrastructure/ioc.types';
import { Proxy } from '../schemas';
import { CreateProxyDto } from '@app/common';

@Injectable()
export class ProxyService {
  constructor(
    @Inject(IocTypes.ProxyRepository)
    private readonly proxyRepository: EntityRepository<Proxy>,
  ) {}

  findProxies(query: FilterQuery<Proxy>): Promise<Proxy[]> {
    return this.proxyRepository.findMany(query);
  }

  findProxiesByRange(
    limit: number,
    offset: number,
    query: FilterQuery<Proxy> = {},
    sortOptions?: Record<string, 1 | -1>,
  ): Promise<Proxy[]> {
    return this.proxyRepository.findByRange(limit, offset, query, sortOptions);
  }

  findProxyById(id: string) {
    return this.proxyRepository.findById(id);
  }

  async updateProxy(proxyId: string, entity: UpdateQuery<Proxy>): Promise<Proxy | null> {
    return this.proxyRepository.update(proxyId, entity);
  }

  getCount(query?: FilterQuery<Proxy>): Promise<number> {
    return this.proxyRepository.getCountDocuments(query);
  }

  createProxy(newProxy: CreateProxyDto): Promise<Proxy> {
    return this.proxyRepository.create({ ...newProxy } as Proxy);
  }

  deleteProxyById(id: string): Promise<Proxy | null> {
    return this.proxyRepository.deleteById(id);
  }
}
