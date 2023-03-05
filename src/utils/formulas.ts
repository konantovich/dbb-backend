// Employee salary - base salary plus 3% for each year they have worked with the company,
// but not more than 30% of the base salary.
// Manager salary - base salary plus 5% for each year they have worked with the company (but
// not more than 40% of the base salary), plus 0.5% of the salaries of their first-level
// subordinates.
// Sales salary - base salary plus 1% for each year they have worked with the company (but not
// more than 35% of the base salary) plus 0.3% of the salaries of their subordinates of any level.

export const staffSalary = (
  dateHired: string,
  dateNow: string,
  staffType: string,
  basicSalary: number,
  subordinates: object[],
) => {
  if (typeof dateHired !== 'string' || typeof dateNow !== 'string') {
    return 'Date error';
  }
  if (typeof basicSalary !== 'number') {
    return 'Salary error';
  }
  const dateHiredConverted = Date.parse(dateHired);
  const dateNowConverted = Date.parse(dateNow);

  //Get how many years staff work.
  //-1 because the first year doesn't count
  const getYearsHiredCount =
    Math.floor((dateNowConverted - dateHiredConverted) / 31536000000) - 1;

  console.log('getYearsHiredCount', getYearsHiredCount);

  //If Employee
  if (staffType === 'Employee') {
    //maximum bonus for years of work
    let getMaxSalaryBonusForYears = basicSalary * 0.3;

    //We add a percentage for the year. Each new year we take into account the bonus of the previous year
    let salaryChangedPerYear = basicSalary;
    for (let i = 0; i < getYearsHiredCount; i++) {
      salaryChangedPerYear = salaryChangedPerYear + salaryChangedPerYear * 0.03;
    }

    //If the bonus is higher than the maximum possible, then return the maximum possible. And round
    salaryChangedPerYear = Math.round(salaryChangedPerYear);
    getMaxSalaryBonusForYears = getMaxSalaryBonusForYears + basicSalary;
    if (salaryChangedPerYear > getMaxSalaryBonusForYears) {
      return getMaxSalaryBonusForYears;
    } else {
      return salaryChangedPerYear;
    }

    // //If Manager or Sales
  } else if (staffType === 'Manager' || staffType === 'Sales') {
    //max % of the base salary for Managers or Sales
    const maxPercentSalaryForYears = staffType === 'Manager' ? 0.4 : 0.35;
    // % bonus per years of the base salary for Managers or Sales
    const percentBonusForYears = staffType === 'Manager' ? 0.05 : 0.01;
    // % bonus per subordinate salary for Managers or Sales
    const percentBonusPerSubardinate = staffType === 'Manager' ? 0.005 : 0.003;

    //maximum bonus for years of work
    let getMaxSalaryBonusForYears = basicSalary * maxPercentSalaryForYears;

    //We add a percentage for the year. Each new year we take into account the bonus of the previous year
    let salaryChangedPerYear = basicSalary;
    for (let i = 0; i < getYearsHiredCount; i++) {
      salaryChangedPerYear =
        salaryChangedPerYear + salaryChangedPerYear * percentBonusForYears;
    }

    //If the bonus is higher than the maximum possible, then return the maximum possible. And round
    let salaryWithYearsBonus = 0;
    salaryChangedPerYear = Math.round(salaryChangedPerYear);
    getMaxSalaryBonusForYears = getMaxSalaryBonusForYears + basicSalary;
    if (salaryChangedPerYear > getMaxSalaryBonusForYears) {
      salaryWithYearsBonus = getMaxSalaryBonusForYears;
    } else {
      salaryWithYearsBonus = salaryChangedPerYear;
    }

    //Bonus calculation from subordinates
    let bonusesForSubardinates = 0;
    if (subordinates.length <= 0) {
      return salaryWithYearsBonus;
    } else {
      subordinates.map((subordinate: { id: string; currentSalary: number }) => {
        const bonusFromSubordinate =
          subordinate.currentSalary * percentBonusPerSubardinate;
        bonusesForSubardinates = bonusesForSubardinates + bonusFromSubordinate;
      });
      return Math.round(salaryWithYearsBonus + bonusesForSubardinates);
    }
  } else {
    return 'Type error';
  }
};

// console.log(
//   'Employee',
//   staffSalary(
//     '2013-03-04T09:28:24.000Z',
//     '2023-04-04T09:46:49.000Z',
//     'Employee',
//     1000,
//     [],
//   ),
// );

// console.log(
//   'Manager',
//   staffSalary(
//     '2018-03-04T09:28:24.000Z',
//     '2023-04-04T09:46:49.000Z',
//     'Manager',
//     1000,
//     [
//       { id: '7', currentSalary: 1194 },
//       { id: '8', currentSalary: 1000 },
//     ],
//   ),
// );

// console.log(
//   'Sales',
//   staffSalary(
//     '2018-03-04T09:28:24.000Z',
//     '2023-04-04T09:46:49.000Z',
//     'Sales',
//     1000,
//     [
//       { id: '7', currentSalary: 1194 },
//       { id: '8', currentSalary: 1000 },
//     ],
//   ),
// );
