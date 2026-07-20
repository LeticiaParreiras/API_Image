import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ImagesModule } from './images/images.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { FollowModule } from './follow/follow.module';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [ImagesModule,
    MongooseModule.forRoot('mongodb://localhost:27017/image'),
    UserModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    FollowModule,
    PostsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
