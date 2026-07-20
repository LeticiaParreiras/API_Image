import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from 'src/user/schema/user.schema';
import { Image } from 'src/images/schema/image.schema';

@Schema({ timestamps: true })
export class Post extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Image', required: true })
  image: Image;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ maxLength: 200 })
  text: string;

  @Prop({ type: [{ user: mongoose.Schema.Types.ObjectId, text: String, createdAt: Date }], default: [] })
  comments: Array<{
    user: mongoose.Schema.Types.ObjectId;
    text: string;
    createdAt: Date;
  }>;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);
