import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class Credentials {
  @Prop({ type: String, unique: true, required: true, index: true })
  login!: string;

  @Prop({ type: String, required: true })
  password!: string;
}

export const CredentialsSchema = SchemaFactory.createForClass(Credentials);
