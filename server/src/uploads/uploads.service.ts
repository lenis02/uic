import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import {
  MAX_UPLOAD_BYTES,
  UPLOAD_PRESETS,
  type UploadKind,
} from './upload-presets';

@Injectable()
export class UploadsService {
  constructor(private readonly configService: ConfigService) {}

  // 브라우저가 Cloudinary로 직접 업로드할 때 쓸 1회용 서명을 만든다.
  // api_secret은 여기서만 쓰고 응답에는 절대 담지 않는다.
  createSignature(kind: UploadKind) {
    const cloudName = this.configService.get<string>('CLOUDINARY_CLOUD_NAME');
    const apiKey = this.configService.get<string>('CLOUDINARY_API_KEY');
    const apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET');

    if (!cloudName || !apiKey || !apiSecret) {
      throw new InternalServerErrorException(
        'Cloudinary 환경변수가 설정되지 않았습니다.',
      );
    }

    const preset = UPLOAD_PRESETS[kind];
    const params = {
      ...preset.params,
      timestamp: Math.round(Date.now() / 1000),
    };

    return {
      uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/${preset.resourceType}/upload`,
      apiKey,
      params,
      signature: cloudinary.utils.api_sign_request(params, apiSecret),
      maxFileSize: MAX_UPLOAD_BYTES,
    };
  }
}
