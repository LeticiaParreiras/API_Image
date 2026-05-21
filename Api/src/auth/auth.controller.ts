import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SignUserDto } from './dto/sigin-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {

  }
  @Post('/register')
  async register(@Body() registerUser: CreateUserDto): Promise<any> {
    return await this.authService.register(registerUser)
  }

  @Post('/login')
  async login(@Body() signUser: SignUserDto){
    return await this.authService.signIn(signUser)
  }
}
