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

@Controller('Image')
export class ImageController {
  constructor(private readonly ImageService: ImageService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({
        maxSize: 1024 * 1024, // 1 MB
          message: 'O arquivo deve ter no máximo 1MB.',
      }),
    ],
  }),
  
)
file: Express.Multer.File,
@CurrentUser() user: CurrentUserDto
  ) {
    const image = await this.ImageService.saveImage(file, user);
    return {
      message: 'Imagem salva com sucesso no banco!',
      id: image._id,
      url: `http://localhost:3000/image/${image._id}`,
    };
  }


  @Get('user/:username')
  async getImagesByUsername(
    @Param('username') username: string,
  ) {
    const images = await this.ImageService.getImagesByUsername(username);
    if (!images) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return images.map((img) => ({
      id: img._id,
      url: `http://localhost:3000/image/${img._id}`,
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

  @Delete(':id')
  async deleteImage(@Param('id') id: string) {
    const image = await this.ImageService.deleteImage(id);
    if (!image) {
      throw new NotFoundException('Imagem não encontrada');
    }
    return { message: 'Imagem deletada com sucesso' };
  }
}
