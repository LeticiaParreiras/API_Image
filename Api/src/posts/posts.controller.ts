import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  UploadedFile,
  UseInterceptors,
  MaxFileSizeValidator,
  ParseFilePipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { PostResponseDto } from './dto/post-response.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { CurrentUserDto } from 'src/auth/dto/current-user.dto';

@Controller('post')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async createPost(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024, // 1 MB
            message: 'The file must be smaller than or equal to 1 MB.',
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() createPostDto: CreatePostDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    const post = await this.postsService.createPost(file, createPostDto, user);
    return {
      message: 'Post crete with success',
      id: post._id,
    };
  }

  @Get()
  async getAllRecentPosts() {
    const posts = await this.postsService.getAllPosts();
    if (!posts) return { mensage: 'No posts found' };
    return posts
  }

  @Get('user/:username')
  async getPostsByUser(@Param('username') username: string) {
    const posts = await this.postsService.getPostsByUsername(username);
    if (!posts) return { mensage: 'No posts found' };
    return posts
  }
  
  @Get('liked')
  @UseGuards(JwtAuthGuard)
  async getMyLikes(@CurrentUser() user: CurrentUserDto){
    const posts = await this.postsService.postILike(user)
    if (!posts || posts.length == 0) return {message: "You didn't like any post"}
    return posts.map((post)=>{
      return {
          id: post._id.toString(),
          text: post.text,
          imageUrl: `http://localhost:3000/image/${post.image._id}`,
          username: post.user.username,
          commentsCount: post.comments.length,
          createdAt: post.createdAt,
        };
    })
  }

  @Get(':id')
  async getPostById(@Param('id') id: string): Promise<PostResponseDto> {
    return await this.postsService.getPostById(id);
  }
  @Post('like/:id')
  @UseGuards(JwtAuthGuard)
  async likePost(
    @Param('id') postId: string,
    @CurrentUser() user: CurrentUserDto,

  ) {
    const posts = await this.postsService.likePost(postId, user);
    if (posts){
      return { message: 'post liked sucess' };
    }
    return {code: 304 }
  }

  @Delete('like/:id')
  @UseGuards(JwtAuthGuard)
  async unlikePost(
    @Param('id') postId: string,
    @CurrentUser() user: CurrentUserDto,
  ){
    const posts = await this.postsService.unlikePost(postId, user);
    if (posts){
      return { message: 'post unliked sucess' };
    }
    return { code: 304 };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(
    @Param('id') postId: string,
    @CurrentUser() user: CurrentUserDto,
  ) {
    await this.postsService.deletePost(postId, user);
  }
}
