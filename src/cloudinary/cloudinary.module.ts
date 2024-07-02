import { Module } from '@nestjs/common';

import { JwtAuthStrategy } from '../auth/strategies/jwt-auth.strategy';
import { SharedModule } from '../shared/shared.module';
import { CloudinaryProvider } from './cloudinary.provider';
import { CloudinaryController } from './controllers/cloudinary.controller';
import { CloudinaryService } from './services/cloudinary.service';

@Module({
  imports: [SharedModule],
  providers: [CloudinaryProvider, CloudinaryService, JwtAuthStrategy],
  exports: [CloudinaryProvider, CloudinaryService],
  controllers: [CloudinaryController],
})
export class CloudinaryModule {}
