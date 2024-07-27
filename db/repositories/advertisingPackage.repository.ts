import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { AdvertisingPackage } from '../entities/advertisingPackage.entity';

@Injectable()
export class AdvertisingPackageRepository extends Repository<AdvertisingPackage> {
  constructor(private dataSource: DataSource) {
    super(AdvertisingPackage, dataSource.createEntityManager());
  }
}
