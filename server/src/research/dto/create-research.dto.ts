import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateResearchDto {
  @IsString()
  @IsNotEmpty({
    message: '카테고리를 선택해주세요 (예: Industry, Company, Macro)',
  })
  category: string;

  @IsString()
  @IsNotEmpty({ message: '리서치 제목을 입력해주세요' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: '작성자(또는 기수)를 입력해주세요' })
  author: string;

  // pdfUrl과 thumbnailUrl은 컨트롤러에서 파일 업로드 후
  // 서비스단으로 넘겨줄 때 합쳐지므로 DTO에서는 필수입력값으로 두지 않습니다.
}
