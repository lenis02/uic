import { BadRequestException } from '@nestjs/common';
import { type Options, type FileFilterCallback } from 'multer';
import { extname } from 'path';

const IMAGE_MIME_WHITELIST = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
]);
const IMAGE_EXT_WHITELIST = new Set(['.jpg', '.jpeg', '.png', '.webp']);

const PDF_MIME_WHITELIST = new Set(['application/pdf']);
const PDF_EXT_WHITELIST = new Set(['.pdf']);

// 지원서 양식 파일. HWP는 브라우저/OS마다 MIME이 제각각이고
// application/octet-stream으로 올라오는 경우가 흔해서 확장자로 판별한다.
const JOIN_FORM_EXT_WHITELIST = new Set(['.pptx', '.docx', '.hwp']);

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
    fileSize: 25 * 1024 * 1024,
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

export const joinFormUploadOptions: Options = {
  limits: {
    fileSize: 25 * 1024 * 1024,
  },
  fileFilter: (req, file, callback) => {
    if (!hasAllowedExtension(file.originalname, JOIN_FORM_EXT_WHITELIST)) {
      return rejectFile(
        callback,
        'PPTX, DOCX, HWP 파일만 업로드할 수 있습니다.',
      );
    }
    callback(null, true);
  },
};

export const researchUploadOptions: Options = {
  limits: {
    fileSize: 25 * 1024 * 1024,
  },
  fileFilter: (req, file, callback) => {
    if (file.fieldname === 'pdf') {
      if (!PDF_MIME_WHITELIST.has(file.mimetype)) {
        return rejectFile(callback, 'The pdf field only accepts PDF files.');
      }
      if (!hasAllowedExtension(file.originalname, PDF_EXT_WHITELIST)) {
        return rejectFile(callback, 'The pdf field has an invalid extension.');
      }
      callback(null, true);
      return;
    }

    rejectFile(callback, `Unexpected file field: ${file.fieldname}`);
  },
};
