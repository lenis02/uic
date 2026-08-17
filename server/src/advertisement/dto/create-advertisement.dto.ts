import {
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { AD_PLACEMENTS } from '../entities/advertisement.entity';
import type { AdPlacement } from '../entities/advertisement.entity';

export class CreateAdvertisementDto {
  @IsIn(AD_PLACEMENTS)
  placement: AdPlacement;

  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsOptional()
  @IsUrl({}, { message: '올바른 링크 URL을 입력해주세요.' })
  linkUrl?: string;

  @IsOptional()
  @IsString()
  altText?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isActive?: boolean;
}
