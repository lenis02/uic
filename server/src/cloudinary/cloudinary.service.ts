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
          folder: 'uic_files', // (기존 폴더명 유지)

          // 👇 [추가 1] PDF, 이미지 등 형식을 자동 감지
          resource_type: 'auto',

          // 👇 [핵심 해결] 파일을 '공개(Public)' 상태로 강제 설정 (이게 없어서 401 뜸)
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
