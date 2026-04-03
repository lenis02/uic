import { IsNotEmpty, IsString } from 'class-validator';

export class CreateResearchDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  year: string;
}
