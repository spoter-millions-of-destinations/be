import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Comment } from '../../db/entities/comment.entity';
import { CommentRepository } from '../../db/repositories/comment.repository';
import { JwtAuthStrategy } from '../auth/strategies/jwt-auth.strategy';
import { SharedModule } from '../shared/shared.module';
import { UserModule } from '../user/user.module';
import { CommentController } from './controllers/comment.controller';
import { CommentService } from './services/comment.service';
import { CommentAclService } from './services/comment-acl.service';

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([Comment]), UserModule],
  providers: [
    CommentService,
    JwtAuthStrategy,
    CommentAclService,
    CommentRepository,
  ],
  controllers: [CommentController],
})
export class CommentModule {}
