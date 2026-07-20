import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/schema/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { SignUserDto } from './dto/sigin-user.dto';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(userRegister: CreateUserDto): Promise<any> {
    const existUsername = await this.userModel
      .findOne({
        username: userRegister.username,
      })
      .exec();
    if (existUsername) {
      throw new BadRequestException('Username already in use');
    }
    const existEmail = await this.userModel
      .findOne({
        username: userRegister.username,
      })
      .exec();
    if (existEmail) {
      throw new BadRequestException('email already in use');
    }
    // salt e hash da senha
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(userRegister.password, salt, 32)) as Buffer;
    const saltedHash = salt + '.' + hash.toString('hex');

    const user = await this.userModel.create({
      ...userRegister,
      password: saltedHash,
    });
    const { password: _, ...result } = user.toObject();
    return result;
  }

  async signIn(userSignIn: SignUserDto) {
    const user = await this.userModel
      .findOne({ email: userSignIn.email })
      .exec();

    if (!user) {
      throw new BadRequestException('Credencial invalid');
    }

    const [salt, storageHash] = user.password.split('.');
    const hash = (await scrypt(userSignIn.password, salt, 32)) as Buffer;
    if (storageHash !== hash.toString('hex')) {
      throw new BadRequestException('Credencial invalid');
    }
    const payload = { username: user.username, sub: user._id };
    return { accessToken: this.jwtService.sign(payload) };
  }
}
