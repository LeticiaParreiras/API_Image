import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ImagesModule } from './images/images.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [ImagesModule,
    MongooseModule.forRoot('mongodb://localhost/:27017',{dbName: 'imageDb'})
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
