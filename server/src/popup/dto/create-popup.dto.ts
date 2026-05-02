import { IsBoolean, IsDateString, IsOptional, IsUrl } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreatePopupDto {
  @IsOptional()
  @IsUrl()
  linkUrl?: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isActive?: boolean;
}
