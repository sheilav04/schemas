import { IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateSchemaDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  @MinLength(5)
  description: string;

  @IsOptional()
  scheludedTime?: Date;

  @IsOptional()
  @IsNumber()
  priority?: number;
}
