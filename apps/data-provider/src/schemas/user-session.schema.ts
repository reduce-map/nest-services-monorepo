import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class Session {
  @Prop({ type: String, required: true })
  source!: string; // who, like mozila or desktop app

  @Prop({ type: String, required: true })
  location!: string;

  @Prop({ type: String, required: true })
  address!: string;

  @Prop({ type: Date, required: true })
  connectedAt!: Date;

  @Prop({ type: Date, required: true })
  expires!: Date;

  @Prop({ type: String, required: true })
  token!: string;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
