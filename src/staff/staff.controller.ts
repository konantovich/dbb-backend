import {
  Body,
  Param,
  Controller,
  Get,
  Post,
  Delete,
  Put,
  HttpStatus,
  HttpCode,
  ValidationPipe,
  Header,
  UsePipes,
  HttpException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository, UpdateResult, DeleteResult } from 'typeorm';
import { StaffService } from './staff.service';
import { StaffEntity } from './schemas/staff.entity';
import { CompanyEntity } from './schemas/company.entity';
import { StaffMemberTypeEntity } from './schemas/staff-member-type.entity';
import { SubordinateEntity } from './schemas/subordinate.entity';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { UpdateSubadinateteDto } from './dto/update-subardinate.dto';

@Controller('staff')
export class StaffController {
  constructor(private staffService: StaffService) {}
  @Get('')
  async getAll(): Promise<StaffEntity[]> {
    return await this.staffService.getAll();
  }

  @Get('getAllStaffSelery')
  async getAllStaffSelery(): Promise<number> {
    return await this.staffService.getAllStaffSelery();
  }

  @Get(':id')
  async getOne(@Param('id') id: string): Promise<StaffEntity> {
    return this.staffService.getOne(id);
  }
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Header('Cache-Control', 'none')
  @UsePipes(ValidationPipe)
  async create(@Body() CreateStaffDto: CreateStaffDto): Promise<StaffEntity> {
    return await this.staffService.create(CreateStaffDto);
  }
  @Put(':id')
  async update(
    @Param() id: string,
    @Body() UpdateStaffDto: UpdateStaffDto,
  ): Promise<UpdateResult> {
    return await this.staffService.update(id, UpdateStaffDto);
  }
  @Delete(':id')
  async delete(@Param() id: string): Promise<DeleteResult> {
    return await this.staffService.remove(id);
  }
  @Get('subordinates/:name')
  async getSubordinates(
    @Param('name') name: string,
  ): Promise<SubordinateEntity[]> {
    return this.staffService.getSubordinates(name);
  }

  @Put('subordinates/:name')
  async calcSalaryWithSubardinatesBonus(
    @Param('name') name: string,
  ): Promise<UpdateResult> {
    return this.staffService.calcSalaryWithSubardinatesBonus(name);
  }

  @Post('subordinates')
  async addSubordinate(
    @Body() UpdateSubadinateteDto: UpdateSubadinateteDto,
  ): Promise<SubordinateEntity> {
    console.log('UpdateSubadinateteDto');
    return await this.staffService.addSubordinate(UpdateSubadinateteDto);
  }
}
