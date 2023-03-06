import { Module } from '@nestjs/common';
import { StaffService } from './staff.service';
import { StaffController } from './staff.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaffEntity } from './schemas/staff.entity';
import { CompanyEntity } from './schemas/company.entity';
import { StaffMemberTypeEntity } from './schemas/staff-member-type.entity';
import { SubordinateEntity } from './schemas/subordinate.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CompanyEntity,
      StaffEntity,
      StaffMemberTypeEntity,
      SubordinateEntity,
    ]),
  ],
  providers: [StaffService],
  controllers: [StaffController],
})
export class StaffModule {}
