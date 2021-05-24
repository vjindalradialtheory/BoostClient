import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IQuote, Quote } from '../quote.model';
import { QuoteService } from '../service/quote.service';

@Injectable({ providedIn: 'root' })
export class QuoteRoutingResolveService implements Resolve<IQuote> {
  constructor(protected service: QuoteService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IQuote> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((quote: HttpResponse<Quote>) => {
          if (quote.body) {
            return of(quote.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Quote());
  }
}
