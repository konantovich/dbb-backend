import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsDateString,
  IsUUID,
  isString,
  IsOptional,
} from 'class-validator';

export class CreateStaffDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  hiredDate: string;

  @IsNumber()
  @IsNotEmpty()
  baseSalary: number;

  @IsNumber()
  @IsNotEmpty()
  currentSalary: number;

  @IsString()
  companyName: string;

  @IsOptional()
  supervisorName?: string;

  @IsString()
  typeName: string;
}
