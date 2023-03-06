import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { StaffEntity } from './staff.entity';

@Entity('subordinate')
export class SubordinateEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => StaffEntity, (staff) => staff.subordinate)
  supervisor: StaffEntity;

  @ManyToOne(() => StaffEntity, (staff) => staff.supervisor)
  subordinate: StaffEntity;
}
