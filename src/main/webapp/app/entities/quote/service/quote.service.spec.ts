import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IQuote, Quote } from '../quote.model';

import { QuoteService } from './quote.service';

describe('Service Tests', () => {
  describe('Quote Service', () => {
    let service: QuoteService;
    let httpMock: HttpTestingController;
    let elemDefault: IQuote;
    let expectedResult: IQuote | IQuote[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(QuoteService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        name: 'AAAAAAA',
        quoteDate: currentDate,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            quoteDate: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Quote', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            quoteDate: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            quoteDate: currentDate,
          },
          returnedFromService
        );

        service.create(new Quote()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Quote', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
            quoteDate: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            quoteDate: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Quote', () => {
        const patchObject = Object.assign({}, new Quote());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            quoteDate: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Quote', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
            quoteDate: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            quoteDate: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Quote', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addQuoteToCollectionIfMissing', () => {
        it('should add a Quote to an empty array', () => {
          const quote: IQuote = { id: 123 };
          expectedResult = service.addQuoteToCollectionIfMissing([], quote);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(quote);
        });

        it('should not add a Quote to an array that contains it', () => {
          const quote: IQuote = { id: 123 };
          const quoteCollection: IQuote[] = [
            {
              ...quote,
            },
            { id: 456 },
          ];
          expectedResult = service.addQuoteToCollectionIfMissing(quoteCollection, quote);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Quote to an array that doesn't contain it", () => {
          const quote: IQuote = { id: 123 };
          const quoteCollection: IQuote[] = [{ id: 456 }];
          expectedResult = service.addQuoteToCollectionIfMissing(quoteCollection, quote);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(quote);
        });

        it('should add only unique Quote to an array', () => {
          const quoteArray: IQuote[] = [{ id: 123 }, { id: 456 }, { id: 97222 }];
          const quoteCollection: IQuote[] = [{ id: 123 }];
          expectedResult = service.addQuoteToCollectionIfMissing(quoteCollection, ...quoteArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const quote: IQuote = { id: 123 };
          const quote2: IQuote = { id: 456 };
          expectedResult = service.addQuoteToCollectionIfMissing([], quote, quote2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(quote);
          expect(expectedResult).toContain(quote2);
        });

        it('should accept null and undefined values', () => {
          const quote: IQuote = { id: 123 };
          expectedResult = service.addQuoteToCollectionIfMissing([], null, quote, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(quote);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
