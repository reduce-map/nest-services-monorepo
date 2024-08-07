import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { FilterQuery, QueryOptions, Types, UpdateQuery } from 'mongoose';
import { IdentifiableDto } from '@app/common';
import { ProxyCountry, ProxyStatus, ProxyType } from '@app/common/enums/dto/proxy.dto';

@Schema()
export class ProxyTypePort {
  @Prop({ type: String })
  proxyType!: ProxyType;

  @Prop({ type: Number })
  proxyPort!: number;
}
export const ProxyTypePortSchema = SchemaFactory.createForClass(ProxyTypePort);

@Schema()
export class ProxyCredentials {
  @Prop({ type: String })
  login!: string;

  @Prop({ type: String })
  password!: string;
}
export const ProxyCredentialsSchema = SchemaFactory.createForClass(ProxyCredentials);

@Schema()
export class Proxy {
  @Prop({ type: String, required: true })
  proxyIp!: string;

  @Prop({ type: Array, of: ProxyTypePortSchema, required: true })
  proxyTypes!: ProxyTypePort[];

  @Prop({ type: String, required: true })
  status!: ProxyStatus;

  @Prop({ type: ProxyCredentialsSchema, required: true })
  proxyCredentials!: ProxyCredentials;

  @Prop({ type: Date })
  activeUntil?: Date;

  @Prop({ type: String })
  proxyCountry?: ProxyCountry;

  @Prop({ type: String })
  service?: string;

  @Prop([{ type: Types.Array, of: Types.ObjectId, ref: 'SteamAccount' }])
  accounts?: Types.ObjectId[];
}

export const ProxySchema = SchemaFactory.createForClass(Proxy);

export type ProxyIdentified = Proxy & IdentifiableDto;

export type ProxyFindRequest = FilterQuery<Proxy>;
export type ProxyFindResponse = Promise<Proxy[]>;

export type ProxyFindByIdResponse = Promise<Proxy | null>;

export type ProxyUpdateRequest = { id: string; query: UpdateQuery<Proxy> };
export type ProxyUpdateResponse = Promise<Proxy | null>;

export type ProxyFindByRangeResponse = Promise<Proxy[]>;

export type ProxyGetCountRequest = FilterQuery<Proxy>;
export type ProxyGetCountResponse = Promise<number>;

export type ProxyFindByRangeRequest = {
  limit: number;
  offset: number;
  filter: FilterQuery<Proxy>;
  sortOptions?: QueryOptions<Proxy>;
};
