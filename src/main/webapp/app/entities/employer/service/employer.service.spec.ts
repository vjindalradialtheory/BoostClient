import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IEmployer, Employer } from '../employer.model';

import { EmployerService } from './employer.service';

describe('Service Tests', () => {
  describe('Employer Service', () => {
    let service: EmployerService;
    let httpMock: HttpTestingController;
    let elemDefault: IEmployer;
    let expectedResult: IEmployer | IEmployer[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(EmployerService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        name: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Employer', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Employer()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Employer', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Employer', () => {
        const patchObject = Object.assign(
          {
            name: 'BBBBBB',
          },
          new Employer()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Employer', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Employer', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addEmployerToCollectionIfMissing', () => {
        it('should add a Employer to an empty array', () => {
          const employer: IEmployer = { id: 123 };
          expectedResult = service.addEmployerToCollectionIfMissing([], employer);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(employer);
        });

        it('should not add a Employer to an array that contains it', () => {
          const employer: IEmployer = { id: 123 };
          const employerCollection: IEmployer[] = [
            {
              ...employer,
            },
            { id: 456 },
          ];
          expectedResult = service.addEmployerToCollectionIfMissing(employerCollection, employer);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Employer to an array that doesn't contain it", () => {
          const employer: IEmployer = { id: 123 };
          const employerCollection: IEmployer[] = [{ id: 456 }];
          expectedResult = service.addEmployerToCollectionIfMissing(employerCollection, employer);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(employer);
        });

        it('should add only unique Employer to an array', () => {
          const employerArray: IEmployer[] = [{ id: 123 }, { id: 456 }, { id: 63091 }];
          const employerCollection: IEmployer[] = [{ id: 123 }];
          expectedResult = service.addEmployerToCollectionIfMissing(employerCollection, ...employerArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const employer: IEmployer = { id: 123 };
          const employer2: IEmployer = { id: 456 };
          expectedResult = service.addEmployerToCollectionIfMissing([], employer, employer2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(employer);
          expect(expectedResult).toContain(employer2);
        });

        it('should accept null and undefined values', () => {
          const employer: IEmployer = { id: 123 };
          expectedResult = service.addEmployerToCollectionIfMissing([], null, employer, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(employer);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
