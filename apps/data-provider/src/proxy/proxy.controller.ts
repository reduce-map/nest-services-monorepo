import { Controller } from '@nestjs/common';
import { ProxyService } from './proxy.service';
import { MessagePattern } from '@nestjs/microservices';
import { LoggerService, RoutingKeys, RoutingKeysEntities } from '@app/common';
import {
  Proxy,
  ProxyFindByIdResponse,
  ProxyFindByRangeRequest,
  ProxyFindByRangeResponse,
  ProxyFindRequest,
  ProxyFindResponse,
  ProxyGetCountRequest,
  ProxyUpdateRequest,
  ProxyUpdateResponse,
} from '../schemas/proxy.schema';
import { CreateProxyDto } from '@app/common';

@Controller('proxy')
export class ProxyController {
  constructor(
    private readonly logger: LoggerService,
    private readonly proxyService: ProxyService,
  ) {}

  @MessagePattern({ cmd: RoutingKeys.Find, entity: RoutingKeysEntities.Proxy })
  async handleFindProxies(query: ProxyFindRequest): Promise<ProxyFindResponse> {
    this.logger?.info(`Find proxy with query ${Object.values(query).join(';')}`);
    const proxyResult = await this.proxyService.findProxies(query);
    return proxyResult;
  }

  @MessagePattern({ cmd: RoutingKeys.Update, entity: RoutingKeysEntities.Proxy })
  async handleUpdateProxy({ id, query }: ProxyUpdateRequest): ProxyUpdateResponse {
    this.logger?.info(`Update proxy with id ${id} and query ${Object.values(query).join(';')}`);
    const proxyResult = await this.proxyService.updateProxy(id, { ...query });
    return proxyResult;
  }

  @MessagePattern({ cmd: RoutingKeys.FindById, entity: RoutingKeysEntities.Proxy })
  async handleFindByIdProxy(id: string): Promise<ProxyFindByIdResponse> {
    this?.logger.info(`Find proxy by id: ${id}`);
    const proxyResult = await this.proxyService.findProxyById(id);
    return proxyResult;
  }

  @MessagePattern({ cmd: RoutingKeys.FindByRange, entity: RoutingKeysEntities.Proxy })
  async handleFindByRangeProxy({
    limit,
    offset,
    filter = {},
    sortOptions,
  }: ProxyFindByRangeRequest): Promise<ProxyFindByRangeResponse> {
    this?.logger.info(`Find proxy by range: limit - ${limit}, offset - ${offset}  ${JSON.stringify(filter)}`);
    const proxyResult = await this.proxyService.findProxiesByRange(limit, offset, filter, sortOptions);
    return proxyResult;
  }

  @MessagePattern({ cmd: RoutingKeys.GetCount, entity: RoutingKeysEntities.Proxy })
  async handleGetCountProxy(filter?: ProxyGetCountRequest): Promise<number> {
    this?.logger.info(`Get count proxies by filter: ${JSON.stringify(filter)}`);
    const count = await this.proxyService.getCount(filter);
    return count;
  }

  @MessagePattern({ cmd: RoutingKeys.Create, entity: RoutingKeysEntities.Proxy })
  async handleCreateProxy(proxy: CreateProxyDto): Promise<Proxy> {
    this?.logger.info(`Create new proxy: ${JSON.stringify(proxy)}`);
    const result = await this.proxyService.createProxy(proxy);
    return result;
  }

  @MessagePattern({ cmd: RoutingKeys.Delete, entity: RoutingKeysEntities.Proxy })
  async handleDeleteByIdProxy(id: string): Promise<Proxy | null> {
    this?.logger.info(`Delete proxy by id: ${id}`);
    const result = await this.proxyService.deleteProxyById(id);
    return result;
  }
}
