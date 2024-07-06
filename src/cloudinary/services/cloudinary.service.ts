import { BadRequestException, Injectable } from '@nestjs/common';
import { v2 } from 'cloudinary';
import streamifier from 'streamifier';

import { CloudinaryResponse } from '../dtos/cloudinary-output.dto';

@Injectable()
export class CloudinaryService {
  async uploadFileToCloudinary(file: Express.Multer.File, folder: string) {
    const folderName = `${process.env.CLOUDINARY_ORIGIN_FOLDER}/${folder}`;
    return await this.uploadFile(file, folderName).catch(() => {
      throw new BadRequestException('Invalid file type.');
    });
  }

  uploadFile(
    file: Express.Multer.File,
    folderName: string,
  ): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = v2.uploader.upload_stream(
        {
          folder: folderName,
        },
        (error: any, result: CloudinaryResponse | undefined) => {
          if (error) return reject(error);
          if (result === undefined)
            return reject(new Error('Upload resulted in undefined.'));
          resolve(result as CloudinaryResponse);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}
