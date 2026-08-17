import { IsBoolean, IsIn, IsInt, IsOptional, IsString, IsUrl } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import {
  AD_EDGES,
  AD_SECTIONS,
  AD_SIDES,
  AD_TYPES,
} from '../entities/advertisement.entity';
import type {
  AdEdge,
  AdSection,
  AdSide,
  AdType,
} from '../entities/advertisement.entity';

export class CreateAdvertisementDto {
  @IsIn(AD_TYPES)
  type: AdType;

  // anchored일 때 필수. 조합 검증은 서비스에서 한다.
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsOptional()
  @IsIn(AD_SECTIONS)
  section?: AdSection;

  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsOptional()
  @IsIn(AD_EDGES)
  edge?: AdEdge;

  // floating일 때 필수
  @Transform(({ value }) => (value === '' ? undefined : value))
  @IsOptional()
  @IsIn(AD_SIDES)
  side?: AdSide;

  // 허용 범위는 type마다 달라서(AD_SIZE_LIMITS) 서비스에서 검사한다.
  @Type(() => Number)
  @IsInt({ message: '가로 크기는 정수로 입력해주세요.' })
  width: number;

  @Type(() => Number)
  @IsInt({ message: '세로 크기는 정수로 입력해주세요.' })
  height: number;

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
