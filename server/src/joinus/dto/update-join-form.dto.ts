import { IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class UpdateJoinFormDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: '설명 문구를 입력해주세요.' })
  description?: string;

  // 불릿 목록. 줄바꿈이 포함된 문자열 한 덩어리로 받는다.
  @IsOptional()
  @IsString()
  bullets?: string;

  // 파일 자체는 서버를 거치지 않는다. 브라우저가 Cloudinary에 직접 올린 뒤의
  // secure_url이거나, 10MB를 넘어 구글 드라이브 등에 올린 공유 링크가 들어온다.
  // 값이 없으면 기존 파일을 그대로 유지한다.
  @IsOptional()
  @IsUrl()
  @MaxLength(1000)
  fileUrl?: string;

  // 관리자 화면과 JoinUs 카드에 보여줄 파일 이름.
  @IsOptional()
  @IsString()
  @MaxLength(255)
  fileName?: string;
}
