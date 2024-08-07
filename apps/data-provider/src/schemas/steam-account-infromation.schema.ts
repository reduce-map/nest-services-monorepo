import { CurrencyCode } from '@app/common/enums/dto/currencyCode';
import { PrivacySettings } from '@app/common/enums/dto/privacySettings';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ _id: false })
export class SteamAccountInformation {
  @Prop({ type: String, required: true })
  currency!: CurrencyCode;

  @Prop({ type: String, required: true })
  privacySetting!: PrivacySettings;

  @Prop({ type: Number, required: true })
  accountLevel!: number;

  @Prop({ type: Types.ObjectId, ref: 'Email' })
  accountEmail?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Simcard' })
  accountSimcard?: Types.ObjectId;
}

export const SteamAccountInformationSchema = SchemaFactory.createForClass(SteamAccountInformation);
