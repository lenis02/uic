// src/common/utils/multer.options.ts
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerOptions = {
  // 파일 크기 제한: 50MB (50 * 1024 * 1024 bytes)
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
  storage: diskStorage({
    destination: (req, file, callback) => {
      const uploadPath = './uploads';
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath);
      }
      callback(null, uploadPath);
    },
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
    },
  }),
};
