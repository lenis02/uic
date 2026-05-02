import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateResearchDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  category: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  year: string;
}
