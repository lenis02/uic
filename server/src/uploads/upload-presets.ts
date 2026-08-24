// 브라우저 -> Cloudinary 직접 업로드용 프리셋.
//
// Vercel 함수는 요청 body가 4.5MB를 넘으면 413(FUNCTION_PAYLOAD_TOO_LARGE)으로
// 잘려서 NestJS 코드까지 오지도 못한다. 플랜과 무관한 하드 리밋이라 늘릴 수 없다.
// 그래서 큰 파일은 서버를 거치지 않고 브라우저가 Cloudinary로 직접 올리고,
// 서버에는 결과 URL만 넘긴다. 실제 상한은 Cloudinary 무료 플랜 기준 10MB.
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

export const UPLOAD_KINDS = ['research', 'joinForm'] as const;
export type UploadKind = (typeof UPLOAD_KINDS)[number];

type UploadPreset = {
  // Cloudinary 업로드 URL에 들어가는 값. 서명 대상이 아니다.
  resourceType: string;
  // 서명에 포함되며, 클라이언트가 그대로 다시 보내야 하는 값들.
  params: Record<string, string | boolean>;
};

export const UPLOAD_PRESETS: Record<UploadKind, UploadPreset> = {
  // 리서치 PDF. 기존 CloudinaryService.uploadImage와 같은 폴더/옵션을 쓴다.
  research: {
    resourceType: 'auto',
    params: { folder: 'uic_files', access_mode: 'public' },
  },
  // 지원서 양식(pptx/docx/hwp). 이미지가 아니므로 raw로 올린다.
  joinForm: {
    resourceType: 'raw',
    params: {
      folder: 'uic_join_forms',
      access_mode: 'public',
      use_filename: true,
      unique_filename: true,
    },
  },
};
