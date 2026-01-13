// src/modules/history/dto/create-history.dto.ts
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateHistoryDto {
  @IsString()
  @IsNotEmpty({ message: '연도를 입력해주세요 (예: 2024)' })
  year: string;

  @IsString()
  @IsNotEmpty({ message: '날짜를 입력해주세요 (예: 08.22 또는 08.22 ~ 10.22)' })
  date: string;

  @IsString()
  @IsNotEmpty({ message: '내용을 입력해주세요' })
  title: string;

  @IsString()
  @IsOptional()
  type?: string; // MOU, 세미나 등

  @IsString()
  @IsOptional()
  description?: string; // 상세 설명
}
