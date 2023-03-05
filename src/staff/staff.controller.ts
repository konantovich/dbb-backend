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
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { StaffService } from './staff.service';
import { Staff } from './schemas/staff.entity';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';

@Controller('staff')
export class StaffController {
  constructor(private staffService: StaffService) {}
  @Get('')
  async getAll(): Promise<Staff[]> {
    return await this.staffService.getAll();
  }

  @Get('getAllStaffSelery')
  async getAllStaffSelery(): Promise<number> {
    return await this.staffService.getAllStaffSelery();
  }

  @Get(':id')
  async getOne(@Param('id') id: string): Promise<Staff> {
    return this.staffService.getOne(id);
  }
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Header('Cache-Control', 'none')
  @UsePipes(ValidationPipe)
  async create(@Body() CreateStaffDto: CreateStaffDto): Promise<Staff> {
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
}
