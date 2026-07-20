import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types } from 'mongoose';
import { Post } from './schema/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { CurrentUserDto } from 'src/auth/dto/current-user.dto';
import { Image } from 'src/images/schema/image.schema';
import { ImageService } from 'src/images/images.service';
import { LikePost } from './schema/like-post.schema';
import { LikeList, PostResponseDto } from './dto/post-response.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(Image.name) private imageModel: Model<Image>,
    @InjectModel(LikePost.name) private likePostModel: Model<LikePost>,
    private imageService: ImageService,
    private userService: UserService,
  ) {}

  async createPost(
    file: Express.Multer.File,
    createPostDto: CreatePostDto,
    user: CurrentUserDto,
  ): Promise<Post> {
    if (!file) {
      throw new BadRequestException('Imagem é obrigatória');
    }

    const image = await this.imageService.saveImage(file, user);

    const post = new this.postModel({
      image: image._id,
      text: createPostDto.text,
      user: new Types.ObjectId(user.userId),
      comments: [],
    });

    return post.save();
  }

  async getPostById(id: string): Promise<PostResponseDto> {
    const post = await this.postModel
      .findById(id)
      .populate('user', 'username')
      .populate('image')
      .populate('comments');

    if (!post) {
      throw new NotFoundException('Post not founded');
    }

    const postLikes = await this.getPostLikes(post.id);
    
    return {
      id: post._id.toString(),
      text: post.text,
      imageUrl: `http://localhost:3000/image/${post.image._id}`,
      username: post.user.username,
      likeBy: postLikes,
      numberLikes: postLikes.length,
      commentsCount: post.comments.length,
      createdAt: post.createdAt,
    };
  }

  async getPostsByUsername(username: string): Promise<PostResponseDto[] | null> {
    const user = await this.userService.getUserByUsername(username)
    const posts = await this.postModel
      .find({ user: user })
      .populate('user', 'username')
      .populate('image')
      .sort({ createdAt: -1 })
      .exec();

    if (!posts || posts.length === 0) return null;

    const postResponse: PostResponseDto[] = await Promise.all(
      posts.map(async (post) => {
        const postLikes = await this.getPostLikes(post.id);

        return {
          id: post._id.toString(),
          text: post.text,
          imageUrl: `http://localhost:3000/image/${post.image._id}`,
          username: post.user.username,
          likeBy: postLikes,
          numberLikes: postLikes.length,
          commentsCount: post.comments.length,
          createdAt: post.createdAt,
        };
      }),
    );

    return postResponse;
  }

  async getAllPosts(): Promise<PostResponseDto[] | null> {
    const posts = await this.postModel
      .find()
      .populate('user', 'username')
      .populate('image')
      .sort({ createdAt: -1 })
      .exec();
    if (!posts || posts.length === 0) return null;

    const postResponse: PostResponseDto[] = await Promise.all(
      posts.map(async (post) => {
        const postLikes = await this.getPostLikes(post.id);

        return {
          id: post._id.toString(),
          text: post.text,
          imageUrl: `http://localhost:3000/image/${post.image._id}`,
          username: post.user.username,
          likeBy: postLikes,
          numberLikes: postLikes.length,
          commentsCount: post.comments.length,
          createdAt: post.createdAt,
        };
      }),
    );
    return postResponse;
  }
  async getPostLikes(postId: string): Promise<LikeList[]>{
    const likes = await this.likePostModel
      .find({ post: postId })
      .populate('likeBy', 'username')
      .exec();

    return likes.map((l) => {
      const user = l.likeBy as unknown as { _id: string; username: string };
      return {
        id: user._id.toString(),
        username: user.username,
  }

      });
    }
  
  async deletePost(postId: string, userDto: CurrentUserDto): Promise<void> {
    const post = await this.postModel
      .findOne({
        _id: postId,
        user: userDto.userId,
      })
      .exec();
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Deletar a imagem associada ao post
    await this.imageService.deleteImage(post.image.toString(), userDto);

    // Deletar o post
    await this.postModel.deleteOne({ _id: postId });
  }
  async postILike(user: CurrentUserDto): Promise<Post[]> {
    // Busca os registros de LikePost do usuário e retorna os posts associados
    const likes = await this.likePostModel
      .find({ likeBy: new Types.ObjectId(user.userId) })
      .sort({ createdAt: -1 })
      .populate({
        path: 'post',
        populate: [
          { path: 'user', select: 'username' },
          { path: 'text' },
          { path: 'image' },
        ],
      })
      .exec();

    return likes.map((l) => l.post);
  }

  async alreadyLike(postId: string, userId: string) {
    return this.likePostModel
      .findOne({
        post: new Types.ObjectId(postId),
        likeBy: new Types.ObjectId(userId),
      })
      .exec();
  }

  async likePost(postId: string, user: CurrentUserDto): Promise<boolean> {
    const post = await this.postModel
      .findById(new Types.ObjectId(postId))
      .exec();

    if (!post) throw new NotFoundException('Post not found');

    const userObjId = new Types.ObjectId(user.userId);

    const existing = await this.alreadyLike(postId, user.userId);
    if (existing) {
      return false;
    }

    await new this.likePostModel({ post: post._id, likeBy: userObjId }).save();

    return true;
  }

  async unlikePost(postId: string, user: CurrentUserDto): Promise<boolean> {
    const post = await this.postModel.findById(postId).exec();

    if (!post) throw new NotFoundException('Post not found');

    const existing = await this.alreadyLike(postId, user.userId);
    if (!existing) {
      return false;
    }

    await this.likePostModel.deleteOne({ _id: existing._id }).exec();

    return true;
  }
}
