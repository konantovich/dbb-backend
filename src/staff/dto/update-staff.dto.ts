export class UpdateStaffDto {
  readonly id: string;
  readonly name: string;
  readonly baseSalary: number;
  readonly currentSalary: number;
  readonly type: string;
  readonly hiredDate: string;
  readonly supervisor: string | null;
  readonly isSupervisor: boolean;
  readonly subordinates: string[] | null;
  readonly createdAt: Date;
  readonly updtedAt: Date;
}
