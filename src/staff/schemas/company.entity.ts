import {
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  OneToMany,
  Column,
} from 'typeorm';
import { StaffEntity } from './staff.entity';

@Entity('companies')
export class CompanyEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => StaffEntity, (staff) => staff.company)
  staff: StaffEntity[];
}
