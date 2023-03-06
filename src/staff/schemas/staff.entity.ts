import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CompanyEntity } from './company.entity';
import { StaffMemberTypeEntity } from './staff-member-type.entity';
import { SubordinateEntity } from './subordinate.entity';

@Entity('staff')
export class StaffEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  hiredDate: string;

  @Column({ type: 'float' })
  baseSalary: number;

  @Column({ type: 'float' })
  currentSalary: number;

  @ManyToOne(() => CompanyEntity, (company) => company.staff)
  company: CompanyEntity;

  @ManyToOne(() => StaffEntity, (staff) => staff.subordinate)
  supervisor: StaffEntity;

  @OneToMany(() => SubordinateEntity, (staff) => staff.supervisor)
  subordinate: SubordinateEntity[];

  @ManyToOne(() => StaffMemberTypeEntity, (type) => type.staff)
  type: StaffMemberTypeEntity;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
