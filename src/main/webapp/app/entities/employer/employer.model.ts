import { IEmployee } from 'app/entities/employee/employee.model';

export interface IEmployer {
  id?: number;
  name?: string;
  employees?: IEmployee[] | null;
}

export class Employer implements IEmployer {
  constructor(public id?: number, public name?: string, public employees?: IEmployee[] | null) {}
}

export function getEmployerIdentifier(employer: IEmployer): number | undefined {
  return employer.id;
}
