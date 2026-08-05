import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post } from './schema/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { CurrentUserDto } from 'src/auth/dto/current-user.dto';
import { ImageService } from 'src/images/images.service';
import { PostResponseDto } from './dto/post-response.dto';
import { UserService } from 'src/user/user.service';
import { FollowService } from 'src/follow/follow.service';
import { mapPostToDto } from './dto/map-post-response.sto';


@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    private imageService: ImageService,
    private userService: UserService,
    private followService: FollowService,
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

  async getPostById(id: string, currentUser?: CurrentUserDto): Promise<PostResponseDto> {
    const post = await this.postModel
      .findById(id)
      .populate('user', 'username')
      .populate('likeBy', 'username')
      .populate('image')
      .populate('comments');

    if (!post) {
      throw new NotFoundException('Post not founded');
    }

    return {
      id: post._id.toString(),
      text: post.text,
      imageUrl: `http://localhost:3000/image/${post.image._id}`,
      username: post.user.username,
      myPost: post.user.username === currentUser?.username,
      likeBy: [],
     iLike: false,
      numberLikes: post.likeBy.length,
      commentsCount: post.comments.length,
      createdAt: post.createdAt,
    };
  }

  async getPostsByUsername(username: string, currentUser?: CurrentUserDto): Promise<PostResponseDto[] | null> {
    const user = await this.userService.getUserByUsername(username)
    const posts = await this.postModel
      .find({ user: user })
      .populate('user', 'username')
      .populate('image')
      .populate('likeBy', 'username')
      .sort({ createdAt: -1 })
      .exec();

    if (!posts || posts.length === 0) return null;

    return posts.map((post) => mapPostToDto(post, currentUser));
  }

  async getPostsIFollow(currentUser: CurrentUserDto): Promise<PostResponseDto[] | null> {
    const iFollow = await this.followService.getUsersFollow(currentUser.username)
    const followed = iFollow.map((f)=> f.followed)
    const posts = await this.postModel
      .find({ user: { $in: followed } })
        .populate('user', 'username')
        .populate('likeBy', 'username')
      .populate('image')
      .sort({ createdAt: -1 })
      .exec();
    if (!posts || posts.length === 0) return null;

   return posts.map((post) => mapPostToDto(post, currentUser));
  }

  async getAllPosts(currentUser?: CurrentUserDto): Promise<PostResponseDto[] | null> {
    const posts = await this.postModel
      .find()
      .populate('user', 'username')
      .populate('image')
      .populate('likeBy', 'username')
      .sort({ createdAt: -1 })
      .exec();
    if (!posts || posts.length === 0) return null;

    return posts.map((post) => mapPostToDto(post, currentUser));
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
  async postILike(currentUser: CurrentUserDto): Promise<PostResponseDto[] | null> {
    // Busca os registros de LikePost do usuário e retorna os posts associados
     const posts = await this.postModel
      .find()
      .populate('user', 'username')
      .populate('image')
      .populate('likeBy', 'username')
      .where('likeBy').equals(currentUser.userId)
      .exec();

    if (!posts || posts.length === 0) return null;

    return posts.map((post) => mapPostToDto(post, currentUser));
  }



  async likePost(postId: string, currentUser: CurrentUserDto): Promise<boolean> {
    const post = await this.postModel
      .findById(new Types.ObjectId(postId))
      .exec();

    if (!post) throw new NotFoundException('Post not found');

    
    const existing = post.likeBy.some((id) => id.equals(currentUser.userId));
    
    if (existing) {
      return false
    }
    const userObjId = new Types.ObjectId(currentUser.userId);

    post.likeBy.push(userObjId)
    await post.save()

    return true;
  }

  async unlikePost(postId: string, currentUser: CurrentUserDto): Promise<boolean> {
    const post = await this.postModel.findById(postId).exec();

    if (!post) throw new NotFoundException('Post not found');
    const existing = post.likeBy.some((id) => id.equals(currentUser.userId));
    if (!existing) {
      return false;
    }
  const newLikesList = post.likeBy.filter((id) => !id.equals(currentUser.userId));
    post.likeBy = newLikesList
    await post.save()
    return true;
  }
}
