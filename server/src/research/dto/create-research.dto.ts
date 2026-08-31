import { IsNotEmpty, IsString, IsUrl, MaxLength } from 'class-validator';

export class CreateResearchDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  category: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  year: string;

  // 파일 자체는 서버를 거치지 않는다. 브라우저가 Cloudinary에 직접 올린 뒤의
  // secure_url이거나, 10MB를 넘어 구글 드라이브 등에 올린 공유 링크가 들어온다.
  @IsUrl()
  @MaxLength(1000)
  pdfUrl: string;
}
