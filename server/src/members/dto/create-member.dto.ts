// src/modules/members/dto/create-member.dto.ts
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMemberDto {
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty({ message: '기수를 입력해주세요 (예: 19)' })
  generation: number;

  @IsString()
  @IsNotEmpty({ message: '이름을 입력해주세요' })
  @MaxLength(50)
  name: string;

  @IsString()
  @IsNotEmpty({ message: '직책을 입력해주세요 (예: 회장, 리서처)' })
  @MaxLength(100)
  position: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  workplace: string;

  @IsEmail()
  @IsOptional()
  @MaxLength(254)
  email: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;
}
