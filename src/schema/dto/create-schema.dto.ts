import { IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateSchemaDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  @MinLength(5)
  description: string;

  @IsOptional()
  scheduledTime?: Date;

  @IsOptional()
  @IsNumber()
  priority?: number;
}
