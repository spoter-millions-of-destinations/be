import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Attraction } from '../../db/entities/attraction.entity';
import { AttractionRepository } from '../../db/repositories/attraction.repository';
import { JwtAuthStrategy } from '../auth/strategies/jwt-auth.strategy';
import { SharedModule } from '../shared/shared.module';
import { UserModule } from '../user/user.module';
import { AttractionController } from './controllers/attraction.controller';
import { AttractionService } from './services/attraction.service';
import { AttractionAclService } from './services/attraction-acl.service';

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([Attraction]), UserModule],
  providers: [
    AttractionService,
    JwtAuthStrategy,
    AttractionAclService,
    AttractionRepository,
  ],
  controllers: [AttractionController],
})
export class AttractionModule {}
