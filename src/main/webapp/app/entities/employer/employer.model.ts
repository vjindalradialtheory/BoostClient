export interface IEmployer {
  id?: number;
  name?: string;
}

export class Employer implements IEmployer {
  constructor(public id?: number, public name?: string) {}
}

export function getEmployerIdentifier(employer: IEmployer): number | undefined {
  return employer.id;
}
