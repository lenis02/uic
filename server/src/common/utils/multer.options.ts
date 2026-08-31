import { BadRequestException } from '@nestjs/common';
import { type Options, type FileFilterCallback } from 'multer';
import { extname } from 'path';

const IMAGE_MIME_WHITELIST = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
]);
const IMAGE_EXT_WHITELIST = new Set(['.jpg', '.jpeg', '.png', '.webp']);

// Vercel 함수는 요청 body 4.5MB를 넘으면 413으로 잘려서 여기까지 오지도 못한다.
// 플랜과 무관한 하드 리밋이라 설정으로 못 늘린다. 그래서 그 아래인 4MB로 잡고,
// 더 큰 파일이 필요한 리서치/지원서 양식은 브라우저에서 Cloudinary로 직접 올린다.
// (server/src/uploads 참고)
const MAX_PROXIED_UPLOAD_BYTES = 4 * 1024 * 1024;

const hasAllowedExtension = (
  filename: string,
  allowedExtensions: Set<string>,
) => {
  const fileExtension = extname(filename).toLowerCase();
  return allowedExtensions.has(fileExtension);
};

const rejectFile = (
  callback: FileFilterCallback,
  reason: string,
): void => callback(new BadRequestException(reason));

export const imageUploadOptions: Options = {
  limits: {
    fileSize: MAX_PROXIED_UPLOAD_BYTES,
  },
  fileFilter: (req, file, callback) => {
    if (!IMAGE_MIME_WHITELIST.has(file.mimetype)) {
      return rejectFile(callback, 'Only JPG, PNG, WEBP image files are allowed.');
    }
    if (!hasAllowedExtension(file.originalname, IMAGE_EXT_WHITELIST)) {
      return rejectFile(callback, 'Invalid image file extension.');
    }
    callback(null, true);
  },
};
