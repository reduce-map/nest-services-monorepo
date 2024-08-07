import { ApplyingStatuses } from '@app/common/enums/dto/applyingStatuses';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ _id: false })
export class AdditionalInfo {
  @Prop({ type: String })
  description?: string;

  @Prop({ type: String })
  date?: Date;

  @Prop({ type: Object })
  otherParams?: Record<string, unknown>;
}

@Schema({ _id: false })
export class AccountStatus {
  @Prop({ type: String, required: true })
  status!: string;

  @Prop({ type: Boolean, required: true })
  isStatusActive!: boolean;

  @Prop(SchemaFactory.createForClass(AdditionalInfo))
  additionalInfo?: AdditionalInfo;
}

@Schema({ _id: false })
export class SteamAccountStatusesInformation {
  @Prop({ type: Types.Map, of: Date })
  applyingStatuses?: Map<ApplyingStatuses, Date>;

  @Prop({ type: Types.Map, of: [SchemaFactory.createForClass(AccountStatus)] })
  sourceStatuses?: Map<string, AccountStatus[]>;
}

export const SteamAccountAdditionalInfoSchema = SchemaFactory.createForClass(AdditionalInfo);
export const SteamAccountStatuses = SchemaFactory.createForClass(AccountStatus);
export const SteamAccountStatusesInformationSchema = SchemaFactory.createForClass(SteamAccountStatusesInformation);
