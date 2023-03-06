import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsDateString,
  IsUUID,
  isString,
} from 'class-validator';

export class UpdateSubadinateteDto {
  @IsString()
  @IsNotEmpty()
  supervisorName: string;

  @IsString()
  @IsNotEmpty()
  subordinateName: string;
}
