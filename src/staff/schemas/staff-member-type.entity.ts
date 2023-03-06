import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { StaffEntity } from './staff.entity';

@Entity('staff_member_types')
export class StaffMemberTypeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'simple-json' })
  salaryCalculationStrategy: any;

  @OneToMany(() => StaffEntity, (staff) => staff.type)
  staff: StaffEntity[];
}
