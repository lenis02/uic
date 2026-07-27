import { IsBoolean, IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import type { NetworkCategory } from '../entities/network.entity';

export class CreateNetworkDto {
  @IsString()
  @IsNotEmpty({ message: '대학/동아리 이름을 입력해주세요.' })
  name: string;

  @IsOptional()
  @IsIn(['university', 'club'])
  category?: NetworkCategory;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  darkBg?: boolean;
}
