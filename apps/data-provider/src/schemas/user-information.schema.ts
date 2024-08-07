import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class Information {
  @Prop({ type: Date, default: Date.now })
  createdAt!: Date;

  @Prop(String)
  linkedPhone!: string;
}

export const InformationSchema = SchemaFactory.createForClass(Information);
