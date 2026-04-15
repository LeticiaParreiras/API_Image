import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Image extends Document {
  @Prop({ required: true })
  filename: string;

  @Prop({ required: true })
  mimetype: string;

  @Prop({ type: Buffer }) // Equivalente ao 'blob' do SQL
  data: Buffer;
}

export const ImageSchema = SchemaFactory.createForClass(Image);