## README

#All functionality/business logic operates on the backend side
#Frontend just for convenience for basic code review

#
The design pattern is the following:
schemas - abstract models of all entities (company, staff memebers, staff member types, subordinate/supervisor)

#
DB - SQLITE, requests to DB - typeORM

#
Frontend - React + ViteJS

#
Hosting. Backend: Heroku, Frontend: Netlify

#
In utils, the formula for calculating staff members salary bonuses

#
The calculation formula for type staff members is as follows:
Hire date - current date = total years of hire. Each new year from the period of employment adds a percentage to the salary (depending on the type of position) and the next year takes into account the amount of the previous year to add a percentage. In addition to this, for those types of employees who may have subordinates, a percentage of the salary level of their subordinates is added, depending on the type of position.
Some types of employees cannot have subordinates.

#
Managers max 40% for years bonus and 5% per year and 0,5% per subardinate
Sales max 35% for years bonis and 1% per year and 0,3% per subardinate
Employees max 30% for years bonus and 3% per year and 0% per subardinate



