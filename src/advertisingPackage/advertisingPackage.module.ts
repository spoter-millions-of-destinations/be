import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdvertisingPackage } from '../../db/entities/advertisingPackage.entity';
import { AdvertisingPackageRepository } from '../../db/repositories/advertisingPackage.repository';
import { JwtAuthStrategy } from '../auth/strategies/jwt-auth.strategy';
import { SharedModule } from '../shared/shared.module';
import { AdvertisingPackageController } from './controllers/advertisingPackage.controller';
import { AdvertisingPackageService } from './services/advertisingPackage.service';
import { AdvertisingPackageAclService } from './services/advertisingPackage-acl.service';

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([AdvertisingPackage])],
  providers: [
    AdvertisingPackageService,
    JwtAuthStrategy,
    AdvertisingPackageAclService,
    AdvertisingPackageRepository,
  ],
  controllers: [AdvertisingPackageController],
  exports: [AdvertisingPackageService],
})
export class AdvertisingPackageModule {}
