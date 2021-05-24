import * as dayjs from 'dayjs';
import { IEmployer } from 'app/entities/employer/employer.model';

export interface IQuote {
  id?: number;
  name?: string;
  quoteDate?: dayjs.Dayjs;
  employer?: IEmployer;
}

export class Quote implements IQuote {
  constructor(public id?: number, public name?: string, public quoteDate?: dayjs.Dayjs, public employer?: IEmployer) {}
}

export function getQuoteIdentifier(quote: IQuote): number | undefined {
  return quote.id;
}
