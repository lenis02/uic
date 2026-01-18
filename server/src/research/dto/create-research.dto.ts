import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateResearchDto {
  // 제목 (필수)
  @IsString()
  @IsNotEmpty()
  title: string;

  // 작성자 (필수)
  @IsString()
  @IsNotEmpty()
  author: string;

  // 간략한 설명
  @IsString()
  @IsOptional()
  description?: string;
}
