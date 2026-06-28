import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { CurrentUserDto } from 'src/auth/dto/current-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async getUser(currentUser: CurrentUserDto) {
    const user = await this.userModel
      .findOne({ email: currentUser.useEmail, _id: currentUser.userId })
      .exec();
    return user;
  }

  async getUserByUsername(username: string) {
    return this.userModel.findOne({ username }).exec();
  }
}
