import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { TFASecretSource } from '@app/common';

@Schema({ _id: false })
export class TFASecret {
  @Prop({ type: String, enum: TFASecretSource })
  source!: string;

  @Prop({ type: String, required: true })
  secret!: string;

  @Prop({ type: Date, required: true })
  attachedAt!: Date;

  @Prop({ type: Boolean, required: true })
  isEnabled!: boolean;
}

export const TFASecretSchema = SchemaFactory.createForClass(TFASecret);
