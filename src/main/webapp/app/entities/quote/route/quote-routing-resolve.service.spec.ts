jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IQuote, Quote } from '../quote.model';
import { QuoteService } from '../service/quote.service';

import { QuoteRoutingResolveService } from './quote-routing-resolve.service';

describe('Service Tests', () => {
  describe('Quote routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: QuoteRoutingResolveService;
    let service: QuoteService;
    let resultQuote: IQuote | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(QuoteRoutingResolveService);
      service = TestBed.inject(QuoteService);
      resultQuote = undefined;
    });

    describe('resolve', () => {
      it('should return IQuote returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultQuote = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultQuote).toEqual({ id: 123 });
      });

      it('should return new IQuote if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultQuote = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultQuote).toEqual(new Quote());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultQuote = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultQuote).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
