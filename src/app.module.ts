import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AttractionModule } from './attraction/attraction.module';
import { AuthModule } from './auth/auth.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CollectionModule } from './collection/collection.module';
import { CommentModule } from './comment/comment.module';
import { FavoriteModule } from './favorite/favorite.module';
import { PostModule } from './post/post.module';
import { SharedModule } from './shared/shared.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    SharedModule,
    UserModule,
    AuthModule,
    PostModule,
    CloudinaryModule,
    FavoriteModule,
    CollectionModule,
    CommentModule,
    AttractionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
