import {
  Body,
  Controller,
  HttpStatus,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import {
  BaseApiResponse,
  SwaggerBaseApiResponse,
} from '../../shared/dtos/base-api-response.dto';
import { UploadRequest } from '../dtos/uploadParam-input.dto';
import { CloudinaryService } from '../services/cloudinary.service';

@ApiTags('upload')
@Controller('upload')
export class CloudinaryController {
  constructor(private readonly service: CloudinaryService) {}

  @Post()
  @ApiOperation({
    summary: 'Upload API',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: SwaggerBaseApiResponse(String),
  })
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() input: UploadRequest,
  ): Promise<BaseApiResponse<string>> {
    const uploadedImage = await this.service.uploadFileToCloudinary(
      file,
      input.folder,
    );
    return {
      data: uploadedImage.url,
      meta: {},
    };
  }
}
