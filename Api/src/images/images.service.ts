import { Injectable, NotFoundException } from '@nestjs/common';
import { Image } from './schema/image.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class ImageService {
  constructor(
    @InjectModel(Image.name)
    private readonly imageModel: Model<Image>,
  ) {}

  async saveImage(file: Express.Multer.File): Promise<Image> {

    return await this.imageModel.create({
      filename: file.originalname,
      mimetype: file.mimetype,
      data: file.buffer,
    });
  }

 
  async getImage(id: string): Promise<Image | null> {

    return this.imageModel.findById(id).exec();
  }

  async list(): Promise<any[]> {
    const images = await this.imageModel.find().exec();
    return images.map((img) => ({
      id: img._id,
      filename: img.filename,
      mimetype: img.mimetype,
      url: `http://localhost:3000/image/${img._id}`,
    }));
  }

  async deleteImage(id: string) {

    const deleted = await this.imageModel.findByIdAndDelete(id).exec();
    
    if (!deleted) {
      throw new NotFoundException('Imagem não encontrada');
    }
    
    return deleted;
  }
}