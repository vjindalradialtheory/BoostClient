import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { QuoteComponent } from '../list/quote.component';
import { QuoteDetailComponent } from '../detail/quote-detail.component';
import { QuoteUpdateComponent } from '../update/quote-update.component';
import { QuoteRoutingResolveService } from './quote-routing-resolve.service';

const quoteRoute: Routes = [
  {
    path: '',
    component: QuoteComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: QuoteDetailComponent,
    resolve: {
      quote: QuoteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: QuoteUpdateComponent,
    resolve: {
      quote: QuoteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: QuoteUpdateComponent,
    resolve: {
      quote: QuoteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(quoteRoute)],
  exports: [RouterModule],
})
export class QuoteRoutingModule {}
