import { Module } from '@nestjs/common';
import { ImageService } from './images.service';
import { ImageController } from './images.controller';

import { Image, ImageSchema } from './schema/image.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: Image.name, schema: ImageSchema }])],
  controllers: [ImageController],
  providers: [ImageService],
})
export class ImagesModule {}
