import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from 'cloudinary';
const toStream = require('buffer-to-stream');

@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          folder: 'uic_files',
          resource_type: 'auto',
          access_mode: 'public',
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result)
            return reject(
              new InternalServerErrorException('업로드 결과가 없습니다.'),
            );
          resolve(result);
        },
      );
      toStream(file.buffer).pipe(upload);
    });
  }

  async uploadAsWebp(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          folder: 'uic_popups',
          resource_type: 'image',
          format: 'webp',
          access_mode: 'public',
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result)
            return reject(
              new InternalServerErrorException('업로드 결과가 없습니다.'),
            );
          resolve(result);
        },
      );
      toStream(file.buffer).pipe(upload);
    });
  }
}
