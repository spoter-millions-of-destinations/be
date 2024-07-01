import { Module, Post } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PostRepository } from '../../db/repositories/post.repository';
import { JwtAuthStrategy } from '../auth/strategies/jwt-auth.strategy';
import { SharedModule } from '../shared/shared.module';
import { UserModule } from '../user/user.module';
import { PostController } from './controllers/post.controller';
import { PostService } from './services/post.service';
import { PostAclService } from './services/post-acl.service';

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([Post]), UserModule],
  providers: [PostService, JwtAuthStrategy, PostAclService, PostRepository],
  controllers: [PostController],
  exports: [PostService],
})
export class PostModule {}
