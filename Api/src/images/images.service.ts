import { Injectable, NotFoundException } from '@nestjs/common';
import { Image } from './schema/image.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CurrentUserDto } from 'src/auth/dto/current-user.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ImageService {
  constructor(
    @InjectModel(Image.name)
    private readonly imageModel: Model<Image>,
    private readonly userService: UserService 
  ) {}

  async saveImage(
    file: Express.Multer.File,
    userDto: CurrentUserDto,
  ): Promise<Image> {
    const user = await this.userService.getUser(userDto);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return this.imageModel.create({
      filename: file.originalname,
      mimetype: file.mimetype,
      data: file.buffer,
      user: user._id,
    });
  }

 
  async getImage(id: string): Promise<Image | null> {

    return this.imageModel.findById(id).exec();
  }

  async getImagesByUsername(username: string): Promise<Image[] | null> {
    const user = await this.userService.getUserByUsername(username);
    if (!user) {
      return null;
    }

    return this.imageModel.find({ user: user._id }).exec();
  }

  async listRecentImages(): Promise<Image[]> {
    return this.imageModel
      .find()
      .sort({ createdAt: -1 })
      .populate('user', 'username')
      .exec();
  }

  async deleteImage(id: string, userDto: CurrentUserDto) {

    const deleted = await this.imageModel.findByIdAndDelete({
      _id: id,
      user : userDto.userId,

    }).exec();
    
    if (!deleted) {
      throw new NotFoundException('Imagem não encontrada');
    }
    
    return deleted;
  }
}