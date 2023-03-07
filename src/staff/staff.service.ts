import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  FindOneOptions,
  UpdateResult,
  DeleteResult,
  FindOptionsWhere,
} from 'typeorm';
import { StaffEntity } from './schemas/staff.entity';
import { CompanyEntity } from './schemas/company.entity';
import { StaffMemberTypeEntity } from './schemas/staff-member-type.entity';
import { SubordinateEntity } from './schemas/subordinate.entity';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { UpdateSubadinateteDto } from './dto/update-subardinate.dto';
import { staffSalary } from 'src/utils/formulas';
@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(StaffEntity)
    private staffRepository: Repository<StaffEntity>,
    @InjectRepository(CompanyEntity)
    private companyRepository: Repository<CompanyEntity>,
    @InjectRepository(StaffMemberTypeEntity)
    private staffMemberTypeRepository: Repository<StaffMemberTypeEntity>,
    @InjectRepository(SubordinateEntity)
    private subordinateRepository: Repository<SubordinateEntity>,
  ) {}

  //Get all staff members
  async getAll(): Promise<StaffEntity[]> {
    return await this.staffRepository.find({
      relations: ['type', 'supervisor', 'subordinate'],
    });
  }

  //Calc all staff members salary
  async getAllStaffSelery(): Promise<number> {
    const allStaff = await this.staffRepository.find();
    let fullStaffMemersSelery = 0;
    allStaff.map((staff: StaffEntity) => {
      fullStaffMemersSelery = fullStaffMemersSelery + staff.currentSalary;
    });
    return fullStaffMemersSelery;
  }

  //Create a new staff, and calc staff salary bonus by year hired.
  //if companyName == null or typeStaff == null - create new companyName or/and staffType
  async create(staffDto: CreateStaffDto): Promise<StaffEntity> {
    try {
      let company: CompanyEntity;
      let type: StaffMemberTypeEntity;

      //Find or create company
      if (staffDto.companyName) {
        company = await this.companyRepository.findOneBy({
          name: staffDto.companyName,
        });
      }
      if (!company) {
        company = this.companyRepository.create({
          name: staffDto.companyName || 'Unknown Company',
        });
        await this.companyRepository.save(company);
      }

      //Find or create staff type
      if (
        staffDto.typeName === 'Sales' ||
        staffDto.typeName === 'Manager' ||
        staffDto.typeName === 'Employee'
      ) {
        if (staffDto.typeName) {
          type = await this.staffMemberTypeRepository.findOneBy({
            name: staffDto.typeName,
          });
        }
        if (!type) {
          type = this.staffMemberTypeRepository.create({
            name: staffDto.typeName || 'Unknown type',
            salaryCalculationStrategy: {},
          });
          await this.staffMemberTypeRepository.save(type);
        }

        let newStaffDto = {};
        const subordinatesSalary = [];
        //Calc bonus salary for years
        const newStaffSalary = staffSalary(
          staffDto.hiredDate.toString(),
          new Date().toString(),
          staffDto.typeName,
          staffDto.baseSalary,
          subordinatesSalary,
        );
        newStaffDto = {
          name: staffDto.name,
          hiredDate: staffDto.hiredDate,
          baseSalary: staffDto.baseSalary,
          currentSalary: newStaffSalary,
          company: company,
          type: type,
        };

        return this.staffRepository.save(newStaffDto);
      } else {
        throw new Error('Type name can only be Manager, Sales or Employee');
      }
    } catch (error) {
      //duplicate name
      console.log('Error:', error);
      throw new InternalServerErrorException();
    }
  }

  //Get one Staff information
  async getOne(id: string): Promise<StaffEntity> {
    try {
      const optionsSubardinate: FindOneOptions<StaffEntity> = {
        where: { id },
        relations: ['type', 'supervisor', 'subordinate'],
      };
      const subordinate = await this.staffRepository.findOne(
        optionsSubardinate,
      );
      return subordinate;
    } catch (error) {
      throw new ConflictException(`Cannot find id ${id}`);
    }
  }

  //Remove Staff
  async remove(id: string): Promise<DeleteResult> {
    try {
      return await this.staffRepository.delete(id);
    } catch (error) {
      throw new ConflictException(`Cannot delete id ${id}`);
    }
  }

  //Update Staff
  async update(id: string, staffDto: UpdateStaffDto): Promise<UpdateResult> {
    return await this.staffRepository.update(id, staffDto);
  }

  //Get all subordinates by supervisor name
  async getSubordinates(name: string): Promise<SubordinateEntity[]> {
    const allSubardinates = await this.subordinateRepository.find({
      relations: ['supervisor', 'subordinate'],
    });
    return allSubardinates.filter((staff) => staff.supervisor.name === name);
  }

  //Calc supervisor bonus by subardinates salary
  async calcSalaryWithSubardinatesBonus(name: string): Promise<UpdateResult> {
    const options = { relations: ['type'] };
    const staff = await this.staffRepository.find({
      where: { name },
      ...options,
    });
    let newSubardinates;
    await this.subordinateRepository
      .find({
        relations: ['supervisor', 'subordinate'],
      })
      .then((subordinates) => {
        newSubardinates = subordinates.filter(
          (staff) => staff.supervisor.id !== staff.id,
        );
      });
    const subordinatesSalary = [];
    newSubardinates.map((sub) => {
      subordinatesSalary.push({
        id: sub.subordinate.id,
        currentSalary: sub.subordinate.currentSalary,
      });
    });

    //Calc supervisor salary with bonus from Sales?(optional) or Employee
    const updatedSupervisorSalary = staffSalary(
      staff[0].hiredDate.toString(),
      new Date().toString(),
      staff[0].type.name,
      staff[0].baseSalary,
      subordinatesSalary,
    );

    return await this.staffRepository.update(staff[0].id, {
      ...staff[0],
      currentSalary: +updatedSupervisorSalary,
    });
  }

  //Add new subardinate to supervisor
  async addSubordinate(
    UpdateSubadinateteDto: UpdateSubadinateteDto,
  ): Promise<SubordinateEntity> {
    try {
      const optionsSupervisor: FindOneOptions<StaffEntity> = {
        where: { name: UpdateSubadinateteDto.supervisorName },
        relations: ['type'],
      };
      const supervisor = await this.staffRepository.findOne(optionsSupervisor);

      const optionsSubardinate: FindOneOptions<StaffEntity> = {
        where: { name: UpdateSubadinateteDto.subordinateName },
        relations: ['type'],
      };
      const subordinate = await this.staffRepository.findOne(
        optionsSubardinate,
      );

      if (!supervisor || !subordinate) {
        throw new Error('Supervisor or subordinate not found');
      }

      if (supervisor.type.name === 'Employee') {
        throw new Error('Employee cannot be supervisor');
      }

      if (
        supervisor.type.name === 'Sales' &&
        subordinate.type.name === 'Manager'
      ) {
        throw new Error('Manager cannot be added to Sales as a subardinate');
      }
      if (
        UpdateSubadinateteDto.subordinateName ===
        UpdateSubadinateteDto.supervisorName
      ) {
        throw new Error('Subardinate or supervisor cannot be added to itself');
      }

      //Check if this subardinate has already been added to the supervisor
      await this.subordinateRepository
        .find({
          relations: ['supervisor', 'subordinate'],
        })
        .then((res) => {
          res.map((all) => {
            if (
              all.supervisor.name === UpdateSubadinateteDto.supervisorName &&
              all.subordinate.name === UpdateSubadinateteDto.subordinateName
            ) {
              throw new Error(
                'This subardinate has already been added to the supervisor',
              );
            }
          });
        });

      subordinate.supervisor = {
        ...supervisor,
        baseSalary: null,
        currentSalary: null,
      };
      await this.staffRepository.save(subordinate);

      const newSubordinate = this.subordinateRepository.create({
        supervisor,
        subordinate,
      });

      return this.subordinateRepository.save(newSubordinate);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: error.message,
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }
}
