import {
  Controller,
  Post,
  Get,
  Param,
  UploadedFile,
  UseInterceptors,
  Res,
  NotFoundException,
  ParseFilePipe,
  MaxFileSizeValidator,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageService } from './images.service';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUserDto } from 'src/auth/dto/current-user.dto';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { ImageResponse } from './dto/image.dto';

@Controller('Image')
export class ImageController {
  constructor(private readonly ImageService: ImageService) {}

  @Get('user/:username')
  async getImagesByUsername(@Param('username') username: string): Promise<ImageResponse[]> {
    const images = await this.ImageService.getImagesByUsername(username);
    if (!images) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return images.map((img) => ({
      url: `http://localhost:3000/image/${img._id}`,
      postesAt: img.createdAt,
      username,
    }));
  }

  @Get('/:id')
  async getImageById(@Param('id') id: string, @Res() res: Response) {
    const image = await this.ImageService.getImage(id);
    if (!image) {
      throw new NotFoundException('Imagem não encontrada');
    }

    res.setHeader('Content-Type', image.mimetype);
    res.send(image.data);
  }

}
