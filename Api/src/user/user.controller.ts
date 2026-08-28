import {
  Controller,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUserDto } from 'src/auth/dto/current-user.dto';
import { CurrentUser } from 'src/auth/current-user.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUser(@CurrentUser() user: CurrentUserDto) {
    return this.userService.getUser(user);
  }
  @Get('/:username')
  getUserByUsername(@Param('username') username: string) {
    return this.userService.getUserByUsername(username);
  }
}
