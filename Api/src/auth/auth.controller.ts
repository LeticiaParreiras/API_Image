import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SignUserDto } from './dto/sigin-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { VerifyTokenResetPasswordDto } from './dto/verify-token-resetPassword.dto';
import { ChangePasswordforgottenDto } from './dto/change-password-forgotten.dto';

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

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordBody: ForgotPasswordDto) {
    await this.authService.forgotPassword(forgotPasswordBody)
  }
  @Get('forgot-password/verify')
  async verifyTokenFogotPassword(@Body() VerifyTokenResetPasswordBody: VerifyTokenResetPasswordDto){
    console.log(VerifyTokenResetPasswordBody)
    const result = await this.authService.verifyTokenResetPassword(VerifyTokenResetPasswordBody)
    if (result) return { mensage: 'Token valid', code: 200 };
  }
   @Patch('forgot-password')
   async changePasswordforgotten(@Body()changePasswordFogottenBody: ChangePasswordforgottenDto){
    await this.authService.changePasswordforgotten(changePasswordFogottenBody)
    return { mensage: 'password change sucess', code: 200 };
   }
}
