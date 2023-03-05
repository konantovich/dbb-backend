import {
  Min,
  MinLength,
  MaxLength,
  IsString,
  IsArray,
  IsBoolean,
} from 'class-validator';

export class CreateStaffDto {
  readonly id: string;

  @IsString()
  @MinLength(2, {
    message: 'Name is too short',
  })
  @MaxLength(50, {
    message: 'Name is too long',
  })
  readonly name: string;

  @Min(1)
  readonly baseSalary: number;
  readonly currentSalary: number;

  @IsString()
  readonly type: string;

  @IsString()
  readonly hiredDate: string;

  @IsString()
  readonly supervisor: string | null;

  @IsBoolean()
  readonly isSupervisor: boolean;

  @IsArray()
  readonly subordinates: string[] | null;
  readonly createdAt: Date;
  readonly updtedAt: Date;
}
