import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { Staff } from './schemas/staff.entity';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { staffSalary } from 'src/utils/formulas';
@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private staffRepository: Repository<Staff>,
  ) {}

  async getAll(): Promise<Staff[]> {
    return await this.staffRepository.find();
  }

  async getAllStaffSelery(): Promise<number> {
    const allStaff = await this.staffRepository.find();
    let allStaffSelery = 0;
    allStaff.map((staff: Staff) => {
      allStaffSelery = allStaffSelery + staff.currentSalary;
    });
    return allStaffSelery;
  }

  async create(staffDto: CreateStaffDto): Promise<any> {
    try {
      //   staffSalary(
      //     '2018-03-04T09:28:24.000Z',
      //     '2023-04-04T09:46:49.000Z',
      //     'Sales',
      //     1000,
      //     [
      //       { id: '7', currentSalary: 1194 },
      //       { id: '8', currentSalary: 1000 },
      //     ],
      //   ),
      const subordinatesSalary = [];
      let newStaffDto = {};
      const allStaff = this.staffRepository.find();
      allStaff.then((res) => {
        res.map((staff, index) => {
          console.log(staff.id, +staffDto.subordinates[index]);
          if (staff.id.toString() === staffDto.subordinates[index]) {
            subordinatesSalary.push({
              id: staff.id,
              currentSalary: staff.currentSalary,
            });
          }
        });
        console.log('subordinatesSalary', staffDto);
        const newStaffSalary = staffSalary(
          staffDto.hiredDate.toString(),
          new Date().toString(),
          staffDto.type,
          staffDto.baseSalary,
          subordinatesSalary,
        );

        newStaffDto = {
          ...staffDto,
          currentSalary: newStaffSalary,
        };
        console.log('newStaffDto', newStaffDto);
        return this.staffRepository.save(newStaffDto);
      });
    } catch (error) {
      //duplicate id
      if (error.code === 'SQLITE_CONSTRAINT') {
        throw new ConflictException('ID already exists');
      } else {
        //internal error occurred on the server.
        throw new InternalServerErrorException();
      }
    }
  }

  async getOne(id: string): Promise<Staff> {
    try {
      return await this.staffRepository.findOneByOrFail({ id });
    } catch (error) {
      throw new ConflictException(`Cannot find id ${id}`);
    }
  }

  async remove(id: string): Promise<DeleteResult> {
    try {
      return await this.staffRepository.delete(id);
    } catch (error) {
      throw new ConflictException(`Cannot delete id ${id}`);
    }
  }

  async update(id: string, staffDto: UpdateStaffDto): Promise<UpdateResult> {
    return await this.staffRepository.update(id, staffDto);
  }
}
