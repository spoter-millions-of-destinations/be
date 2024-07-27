import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { MapboxResponse } from '../../src/utils/getPlaceFromCoordinates';
import { Attraction } from '../entities/attraction.entity';

@Injectable()
export class AttractionRepository extends Repository<Attraction> {
  constructor(private dataSource: DataSource) {
    super(Attraction, dataSource.createEntityManager());
  }

  async getAttractionByPlace(attraction: MapboxResponse): Promise<Attraction | null> {
    return this.findOne({
      where: {
        placeName: attraction.placeName,
        address: attraction.address,
        ward: attraction.ward,
        district: attraction.district,
        city: attraction.city,
        country: attraction.country,
      },
    });
  }

  async createAttraction(attraction: Partial<Attraction>): Promise<Attraction> {
    return this.save(attraction);
  }
}
