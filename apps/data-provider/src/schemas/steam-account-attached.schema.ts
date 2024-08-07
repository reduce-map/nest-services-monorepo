import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { CookieEntry, CookieEntrySchema } from './steam-account-cookie-entry.schema';

@Schema({ _id: false })
export class SteamAccountAttached {
  @Prop({ type: Types.ObjectId, ref: 'Proxy' })
  defaultProxy?: Types.ObjectId;

  @Prop([CookieEntrySchema])
  cookie?: CookieEntry[];

  @Prop([{ type: Types.Array, of: Types.ObjectId, ref: 'Proxy' }])
  backupProxies?: Types.ObjectId[];
}

export const SteamAccountAttachedSchema = SchemaFactory.createForClass(SteamAccountAttached);
