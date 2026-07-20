import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/user/schema/user.schema';
import { Post } from './post.schema';
import mongoose, { Document } from 'mongoose';

@Schema({ timestamps: true })
export class LikePost extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  likeBy: User;
  
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true })
  post: Post;

}
export const LikePostSchema = SchemaFactory.createForClass(LikePost);
// Evita duplicatas de curtida por mesmo usuário no mesmo post
LikePostSchema.index({ post: 1, likeBy: 1 }, { unique: true });