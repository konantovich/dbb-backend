import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  HttpException,
  HttpStatus,
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
  //Create supervisor(optional)
  async create(staffDto: CreateStaffDto): Promise<StaffEntity> {
    console.log(staffDto);
    try {
      let company: CompanyEntity;
      let type: StaffMemberTypeEntity;
      let supervisor: StaffEntity;

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

        // const staff = this.staffRepository.create({
        //   name: staffDto.name,
        //   company: company,
        //   joinDate: staffDto.joinDateHired.toString(),
        //   baseSalary: staffDto.baseSalary,
        //   currentSalary: staffDto.currentSalary,
        // });

        // await this.staffRepository.save(staff);

        // return staff;

        // staffSalary(
        //   '2018-03-04T09:28:24.000Z',
        //   '2023-04-04T09:46:49.000Z',
        //   'Sales',
        //   1000,
        //   [
        //     { id: '7', currentSalary: 1194 },
        //     { id: '8', currentSalary: 1000 },
        //   ],
        // ),

        const allSubordinates = this.staffRepository.find();

        // allSubordinates.then((res) => {
        //   console.log(res);
        //   res
        //     .filter((staff) => staff.supervisorName === staffDto.name)
        //     .map((staff, index) => {
        //       console.log(staff.id, +staffDto.subordinates[index]);
        //       if (staff.id.toString() === staffDto.subordinates[index]) {
        //         subordinatesSalary.push({
        //           id: staff.id,
        //           currentSalary: staff.currentSalary,
        //         });
        //       }
        //     });

        // //Create supervisor
        // if (staffDto.supervisorName && staffDto.typeName !== 'Manager') {
        //   supervisor = await this.staffRepository.findOneBy({
        //     name: staffDto.supervisorName,
        //   });
        //   if (!supervisor) {
        //     supervisor = null;
        //   }
        // } else {
        //   supervisor = null;
        // }

        // if (!supervisor && staffDto.typeName !== 'Employee') {
        //   supervisor = this.subordinateRepository.create({
        //     supervisor: newStaffDto,
        //   });
        //   await this.subordinateRepository.save(supervisor);
        // } else {
        //   supervisor = null;
        // }

        console.log('subordinatesSalary', staffDto);
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
          // supervisor: null,
          // supervisor: {
          //   ...supervisor,
          //   currentSalary: null,
          //   baseSalary: null,
          //   hiredDate: null,
          // },
          // subordinates: null,
        };

        // //Create supervisor
        // if (staffDto.supervisorName && staffDto.typeName !== 'Employee') {
        //   supervisor = await this.subordinateRepository.findOneBy({
        //     supervisor: newStaffDto,
        //   });
        // }

        // if (!supervisor && staffDto.typeName !== 'Employee') {
        //   supervisor = this.subordinateRepository.create({
        //     supervisor: newStaffDto,
        //   });
        //   await this.subordinateRepository.save(supervisor);
        // } else {
        //   supervisor = null;
        // }
        console.log(supervisor);

        console.log('newStaffDto', newStaffDto);
        // });
        return this.staffRepository.save(newStaffDto);
      } else {
        throw new Error('Type name can only be Manager, Sales or Employee');
      }
    } catch (error) {
      //duplicate name
      if (error.code === 'SQLITE_CONSTRAINT') {
        throw new ConflictException('Name already exists');
      } else {
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

  //Get on Staff information
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
      // const supervisor = await this.staffRepository.findOne({
      //   name: UpdateSubadinateteDto.supervisorName,
      //   relations: ['type'],
      // });
      // const subordinate = await this.staffRepository.findOneBy({
      //   name: UpdateSubadinateteDto.subordinateName,
      // });
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

      // const updateSubordinate = new SubordinateEntity();
      // updateSubordinate.supervisor = supervisor;
      // await this.subordinateRepository.save(updateSubordinate);

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

      console.log(newSubordinate);

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
