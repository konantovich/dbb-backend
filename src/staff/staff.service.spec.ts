import { Test, TestingModule } from '@nestjs/testing';
import { StaffService } from './staff.service';
import { staffSalary } from '../utils/formulas';

describe('calculateSalaryIncrease', () => {
  let staffService: StaffService;
  it('should calculate correctly', () => {
    const dateHired = new Date('2020-01-01').toString();
    const dateNow = new Date('2023-02-02').toString();
    const staffType = 'Manager';
    const basicSalary = 1000;
    const subordinates = [
      {
        id: '123',
        currentSalary: 1194,
      },
    ];
    //5.97
    //
    // const maxBonus = 0.4; // 40%
    // const annualBonus = 0.05; // 5%
    // const subordinateBonus = 0.005; // 0.5%
    //1157.6
    const expectedFinalSalary = 1164; //Salary with full bonus

    const actualFinalSalary = staffSalary(
      dateHired,
      dateNow,
      staffType,
      basicSalary,
      subordinates,
    );

    expect(actualFinalSalary).toBe(expectedFinalSalary);
  });
});
