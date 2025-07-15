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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageService } from './images.service';
import { Response } from 'express';

@Controller('Image')
export class ImageController {
  constructor(private readonly ImageService: ImageService) {}

  @Post()
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
file: Express.Multer.File
  ) {
    const image = await this.ImageService.saveImage(file);
    return {
      message: 'Imagem salva com sucesso no banco!',
      id: image.id,
      url: `http://localhost:3000/image/${image.id}`,
    };
  }

  @Get()
  async listImages() {
    return this.ImageService.list();
  }

  @Get(':id')
  async serveImage(@Param('id') id: number, @Res() res: Response) {
    const image = await this.ImageService.getImage(id);
    if (!image) {
      throw new NotFoundException('Imagem não encontrada');
    }

    res.setHeader('Content-Type', image.mimetype);
    res.send(image.data);
  }

  @Delete(':id')
  async deleteImage(@Param('id') id: string) {
    const image = await this.ImageService.deleteImage(+id);
    if (!image) {
      throw new NotFoundException('Imagem não encontrada');
    }
    return { message: 'Imagem deletada com sucesso' };
  }
}
