import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from 'src/user/schema/user.schema';

@Schema()
export class Image extends Document {
  @Prop({ required: true })
  filename: string;

  @Prop({ required: true })
  mimetype: string;

  @Prop({ type: Buffer }) // Equivalente ao 'blob' do SQL
  data: Buffer;
  
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User
}

export const ImageSchema = SchemaFactory.createForClass(Image);