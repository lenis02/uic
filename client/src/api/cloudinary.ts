import { instance } from './axios';

// 브라우저가 Cloudinary로 직접 올릴 수 있는 최대 크기(무료 플랜 상한).
// 이걸 넘는 파일은 드라이브 등 외부 링크로 대신 등록한다.
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

export type UploadKind = 'research' | 'joinForm';

interface UploadSignature {
  uploadUrl: string;
  apiKey: string;
  params: Record<string, string | number | boolean>;
  signature: string;
  maxFileSize: number;
}

export const formatBytes = (bytes: number) => {
  const mb = bytes / 1024 / 1024;
  return `${mb < 10 ? mb.toFixed(1) : Math.round(mb)}MB`;
};

// Vercel 함수는 요청 body 4.5MB가 플랜과 무관한 하드 리밋이라, 큰 파일은
// 애초에 서버까지 도달하지 못한다. 그래서 서버에서는 서명만 받고
// 파일 자체는 브라우저가 Cloudinary로 직접 올린 뒤 URL만 서버에 넘긴다.
export const uploadToCloudinary = async (
  file: File,
  kind: UploadKind
): Promise<string> => {
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error(
      `파일이 ${formatBytes(file.size)}로 최대 ${formatBytes(
        MAX_UPLOAD_BYTES
      )}를 넘습니다. 드라이브 링크로 등록해주세요.`
    );
  }

  const { data } = await instance.post<UploadSignature>('/uploads/signature', {
    kind,
  });

  const form = new FormData();
  form.append('file', file);
  form.append('api_key', data.apiKey);
  form.append('signature', data.signature);
  // 서명에 포함된 값들을 그대로 되돌려 보내야 서명이 맞는다.
  Object.entries(data.params).forEach(([key, value]) =>
    form.append(key, String(value))
  );

  // 관리자 토큰이 Cloudinary로 새지 않도록 axios 인스턴스 대신 fetch를 쓴다.
  const response = await fetch(data.uploadUrl, { method: 'POST', body: form });
  if (!response.ok) {
    throw new Error(
      `Cloudinary 업로드에 실패했습니다. (${response.status}) ${await response.text()}`
    );
  }

  const result = (await response.json()) as { secure_url?: string };
  if (!result.secure_url) {
    throw new Error('Cloudinary 응답에 파일 URL이 없습니다.');
  }
  return result.secure_url;
};
