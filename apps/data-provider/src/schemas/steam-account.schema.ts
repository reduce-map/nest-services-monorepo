import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { FilterQuery, QueryOptions, Types, UpdateQuery } from 'mongoose';

import { SteamAccountCredentials, SteamAccountCredentialsSchema } from './steam-account-credentials.schema';
import {
  SteamAccountStatusesInformation,
  SteamAccountStatusesInformationSchema,
} from './steam-account-statuses-information.schema';
import { SteamAccountInformation, SteamAccountInformationSchema } from './steam-account-infromation.schema';
import { SteamAccountAttached, SteamAccountAttachedSchema } from './steam-account-attached.schema';
import { IdentifiableDto } from '@app/common';

@Schema()
export class SteamAccount {
  @Prop({ type: Types.ObjectId, required: true })
  ownerId!: Types.ObjectId;

  @Prop({ type: String, required: true })
  tradeUrl!: string;

  @Prop({ type: String, required: true })
  steamId64!: string;

  @Prop({ type: String, required: true })
  apiKey!: string;

  @Prop({ type: Number })
  accIndex?: number;

  @Prop({ type: String })
  ownerKey?: string;

  @Prop({ type: SteamAccountCredentialsSchema, required: true })
  credentials!: SteamAccountCredentials;

  @Prop({ type: SteamAccountStatusesInformationSchema })
  information?: SteamAccountStatusesInformation;

  @Prop({ type: SteamAccountInformationSchema })
  accountInformation?: SteamAccountInformation;

  @Prop({ type: SteamAccountAttachedSchema })
  attached?: SteamAccountAttached;
}

export const SteamAccountSchema = SchemaFactory.createForClass(SteamAccount);

// Comment for the future DTO movement
// this is leftover

export type SteamAccountIdentified = SteamAccount & IdentifiableDto;

export type SteamAccountFindRequest = FilterQuery<SteamAccount>;
export type SteamAccountFindResponse = Promise<SteamAccount[]>;

export type SteamAccountUpdateRequest = { id: string; query: UpdateQuery<SteamAccount> };
export type SteamAccountUpdateResponse = Promise<SteamAccount | null>;

export type SteamAccountFindByRangeRequest = {
  limit: number;
  offset: number;
  filter: FilterQuery<SteamAccount>;
  sortOptions?: QueryOptions<SteamAccount>;
};
export type SteamAccountFindByRangeResponse = Promise<SteamAccount[]>;

export type SteamAccountGetCountRequest = FilterQuery<SteamAccount>;
export type SteamAccountGetCountResponse = Promise<number>;

export class UpdateDto<T> {
  id!: string;
  query!: UpdateQuery<T>;
}
