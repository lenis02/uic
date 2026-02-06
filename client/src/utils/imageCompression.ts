import imageCompression from 'browser-image-compression';

export const compressImage = async (file: File) => {
  const options = {
    maxSizeMB: 10, // 최대 용량 1MB로 제한
    maxWidthOrHeight: 1200, // 가로 세로 최대 1200px (프로필 사진으로 충분)
    useWebWorker: true, // 별도 스레드에서 처리 (화면 멈춤 방지)
  };

  try {
    const compressedFile = await imageCompression(file, options);
    // 서버로 보낼 때는 보통 File 객체여야 하므로 변환해서 반환
    return new File([compressedFile], file.name, {
      type: file.type,
    });
  } catch (error) {
    console.error('이미지 압축 중 에러 발생:', error);
    return file; // 실패 시 원본 반환
  }
};
