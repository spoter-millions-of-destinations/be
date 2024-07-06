import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Favorite } from '../../db/entities/favorite.entity';
import { FavoriteRepository } from '../../db/repositories/favorite.repository';
import { JwtAuthStrategy } from '../auth/strategies/jwt-auth.strategy';
import { SharedModule } from '../shared/shared.module';
import { FavoriteController } from './controllers/favorite.controller';
import { FavoriteService } from './services/favorite.service';
import { FavoriteAclService } from './services/favorite-acl.service';

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([Favorite])],
  providers: [
    FavoriteService,
    JwtAuthStrategy,
    FavoriteAclService,
    FavoriteRepository,
  ],
  controllers: [FavoriteController],
  exports: [FavoriteService],
})
export class FavoriteModule {}
