import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class CookieEntry {
  @Prop({ type: [String], required: true })
  domains!: string[];

  @Prop({ type: String, required: true })
  name!: string;

  @Prop({ type: String, required: true })
  value!: string;
}

export const CookieEntrySchema = SchemaFactory.createForClass(CookieEntry);
