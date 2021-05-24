import * as dayjs from 'dayjs';
import { IEmployer } from 'app/entities/employer/employer.model';

export interface IEmployee {
  id?: number;
  name?: string;
  ssno?: string;
  dateOfBirth?: dayjs.Dayjs;
  employer?: IEmployer;
}

export class Employee implements IEmployee {
  constructor(
    public id?: number,
    public name?: string,
    public ssno?: string,
    public dateOfBirth?: dayjs.Dayjs,
    public employer?: IEmployer
  ) {}
}

export function getEmployeeIdentifier(employee: IEmployee): number | undefined {
  return employee.id;
}
