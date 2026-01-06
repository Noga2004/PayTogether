import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreateGroupDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsOptional()
  memberIds?: string[];
}
