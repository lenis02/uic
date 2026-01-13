// src/modules/members/dto/create-member.dto.ts
import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateMemberDto {
  @IsNumber()
  @IsNotEmpty({ message: '기수를 입력해주세요 (예: 19)' })
  generation: number;

  @IsString()
  @IsNotEmpty({ message: '이름을 입력해주세요' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: '직책을 입력해주세요 (예: 회장, 리서처)' })
  position: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;
}
