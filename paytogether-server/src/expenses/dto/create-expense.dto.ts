import { IsString, IsNumber, IsArray, IsUUID, Min } from 'class-validator';

export class CreateExpenseDto {
  @IsString()
  description: string;

  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsUUID()
  groupId: string;

  @IsArray()
  @IsUUID('4', { each: true })
  splitAmongIds: string[];
}
