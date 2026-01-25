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
        { folder: 'uic_members' },
        (error, result) => {
          // 1. 에러가 발생하면 reject
          if (error) return reject(error);

          // [수정 포인트] 2. result가 undefined일 경우를 명확히 처리 (TypeScript 에러 해결)
          if (!result) {
            return reject(
              new InternalServerErrorException(
                'Cloudinary 업로드 결과가 없습니다.',
              ),
            );
          }

          // 3. 이제 result는 무조건 존재하므로 안심하고 resolve
          resolve(result);
        },
      );
      toStream(file.buffer).pipe(upload);
    });
  }
}
