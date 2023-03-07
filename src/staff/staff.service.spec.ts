import { Test, TestingModule } from '@nestjs/testing';
import { staffSalary } from '../utils/formulas';
//Managers max 40% for years bonus and 5% per year and 0,5% per subardinate
//Sales max 35% for years bonis and 1% per year and 0,3% per subardinate
//Employees max 30% for years bonus and 3% per year and 0% per subardinate
describe('calculateSalaryManager', () => {
  it('should calculate correctly for Manager', () => {
    const staffType = 'Manager';
    const dateHired = new Date('2015-01-01T09:28:24.000Z').toString();
    const dateNow = new Date('2023-02-02T09:28:24.000Z').toString();
    const basicSalary = 1000;
    const subordinates = [
      {
        id: '123',
        currentSalary: 1194,
      },
    ];

    const expectedFinalSalary = 1406; //Salary with full bonus

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

describe('calculateSalarySales', () => {
  it('should calculate correctly for Sales', () => {
    const staffType = 'Sales';
    const dateHired = new Date('2018-01-01T09:28:24.000Z').toString();
    const dateNow = new Date('2023-02-02T09:28:24.000Z').toString();
    const basicSalary = 1000;
    const subordinates = [
      {
        id: '123',
        currentSalary: 1000,
      },
      {
        id: '123',
        currentSalary: 1194,
      },
    ];

    const expectedFinalSalary = 1058; //Salary with full bonus

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

describe('calculateSalaryEmployee', () => {
  it('should calculate correctly for Employee', () => {
    const staffType = 'Employee';
    const dateHired = new Date('2019-01-01T09:28:24.000Z').toString();
    const dateNow = new Date('2023-02-02T09:28:24.000Z').toString();
    const basicSalary = 1000;
    const subordinates = [];

    const expectedFinalSalary = 1126; //Salary with full bonus

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

//npm test
