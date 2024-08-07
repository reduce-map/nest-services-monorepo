import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class SteamAccountCredentials {
  @Prop({ type: String, required: true })
  login!: string;

  @Prop({ type: String, required: true })
  password!: string;

  @Prop({ type: String, required: true })
  shared_secret!: string;

  @Prop({ type: String, required: true })
  identity_secret!: string;

  @Prop({ type: String })
  refresh_token?: string;
}

export const SteamAccountCredentialsSchema = SchemaFactory.createForClass(SteamAccountCredentials);
