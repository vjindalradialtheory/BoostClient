import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IQuote, getQuoteIdentifier } from '../quote.model';

export type EntityResponseType = HttpResponse<IQuote>;
export type EntityArrayResponseType = HttpResponse<IQuote[]>;

@Injectable({ providedIn: 'root' })
export class QuoteService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/quotes');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(quote: IQuote): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(quote);
    return this.http
      .post<IQuote>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(quote: IQuote): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(quote);
    return this.http
      .put<IQuote>(`${this.resourceUrl}/${getQuoteIdentifier(quote) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(quote: IQuote): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(quote);
    return this.http
      .patch<IQuote>(`${this.resourceUrl}/${getQuoteIdentifier(quote) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IQuote>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IQuote[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addQuoteToCollectionIfMissing(quoteCollection: IQuote[], ...quotesToCheck: (IQuote | null | undefined)[]): IQuote[] {
    const quotes: IQuote[] = quotesToCheck.filter(isPresent);
    if (quotes.length > 0) {
      const quoteCollectionIdentifiers = quoteCollection.map(quoteItem => getQuoteIdentifier(quoteItem)!);
      const quotesToAdd = quotes.filter(quoteItem => {
        const quoteIdentifier = getQuoteIdentifier(quoteItem);
        if (quoteIdentifier == null || quoteCollectionIdentifiers.includes(quoteIdentifier)) {
          return false;
        }
        quoteCollectionIdentifiers.push(quoteIdentifier);
        return true;
      });
      return [...quotesToAdd, ...quoteCollection];
    }
    return quoteCollection;
  }

  protected convertDateFromClient(quote: IQuote): IQuote {
    return Object.assign({}, quote, {
      quoteDate: quote.quoteDate?.isValid() ? quote.quoteDate.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.quoteDate = res.body.quoteDate ? dayjs(res.body.quoteDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((quote: IQuote) => {
        quote.quoteDate = quote.quoteDate ? dayjs(quote.quoteDate) : undefined;
      });
    }
    return res;
  }
}
