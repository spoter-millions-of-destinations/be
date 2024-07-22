import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Collection } from '../../db/entities/collection.entity';
import { CollectionRepository } from '../../db/repositories/collection.repository';
import { CollectionItemRepository } from '../../db/repositories/collectionItem.repository';
import { PostRepository } from '../../db/repositories/post.repository';
import { JwtAuthStrategy } from '../auth/strategies/jwt-auth.strategy';
import { SharedModule } from '../shared/shared.module';
import { UserModule } from '../user/user.module';
import { CollectionController } from './controllers/collection.controller';
import { CollectionService } from './services/collection.service';
import { CollectionAclService } from './services/collection-acl.service';

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([Collection]), UserModule],
  providers: [
    CollectionService,
    JwtAuthStrategy,
    CollectionAclService,
    CollectionRepository,
    CollectionItemRepository,
    PostRepository,
  ],
  controllers: [CollectionController],
  exports: [CollectionService],
})
export class CollectionModule {}
