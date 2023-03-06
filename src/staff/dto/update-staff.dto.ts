import {
  IsOptional,
  IsString,
  IsNotEmpty,
  IsNumber,
  IsDateString,
  IsUUID,
} from 'class-validator';

export class UpdateStaffDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  hiredDate: string;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  baseSalary: number;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  currentSalary: number;

  @IsString()
  companyName: string;

  @IsOptional()
  @IsString()
  supervisorName: string;

  @IsOptional()
  @IsString()
  typeName: string;
}
