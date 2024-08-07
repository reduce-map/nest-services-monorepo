import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Credentials, CredentialsSchema } from './user-credentials.schema';
import { TFASecret, TFASecretSchema } from './user-tfa-secret.schema';
import { Session, SessionSchema } from './user-session.schema';
import { Information, InformationSchema } from './user-information.schema';

@Schema()
export class UserAccount {
  @Prop(String)
  nickname!: string;

  @Prop(Types.ObjectId)
  syncNode!: Types.ObjectId;

  @Prop({ type: CredentialsSchema, required: true })
  credentials!: Credentials;

  @Prop([TFASecretSchema])
  twoFAsecrets!: TFASecret[];

  @Prop({ type: InformationSchema, required: true })
  information!: Information;

  @Prop({ type: Date })
  lastKeyRotation!: Date;

  @Prop(Boolean)
  isRotationSuccess!: boolean;

  @Prop(String)
  secretStore!: string;

  @Prop([SessionSchema])
  sessions!: Session[];
}
export const UserAccountSchema = SchemaFactory.createForClass(UserAccount);
