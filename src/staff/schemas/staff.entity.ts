import {
  Entity,
  JoinColumn,
  OneToMany,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['id'])
export class Staff {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  baseSalary: number;

  @Column()
  currentSalary: number;

  @Column()
  type: string;

  @Column()
  hiredDate: string;

  @Column()
  supervisor: string | null;

  @Column()
  isSupervisor: boolean;

  @Column('text', { array: true })
  subordinates: string[] | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updtedAt: Date;
}
