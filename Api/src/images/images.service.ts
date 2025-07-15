import { Injectable, MaxFileSizeValidator, ParseFilePipe } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from './entities/image.entity';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image)
    private readonly repo: Repository<Image>,
  ) {}

  async saveImage(file: Express.Multer.File): Promise<Image> {
    const image = this.repo.create({
      filename: file.originalname,
      mimetype: file.mimetype,
      data: file.buffer,
    });

    return this.repo.save(image);
  }

  async getImage(id: number): Promise<Image | null> {
    return this.repo.findOne({ where: { id } });
  }

  async list(): Promise<Partial<Image>[]> {
    const images = await this.repo.find();
    return images.map((img) => ({
      id: img.id,
      filename: img.filename,
      mimetype: img.mimetype,
      url: `http://localhost:3000/image/${img.id}`,
    }));
  }
  async deleteImage(id: number) {
    const image = await this.repo.findOneBy({id});
    if (!image) return null;
    return await this.repo.remove(image);
  }
}
