import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

import { UploadFolder } from '../../auth/constants/uploadFolder.constant';

export class UploadRequest {
  @ApiProperty()
  @IsEnum(UploadFolder)
  folder!: UploadFolder;
}
