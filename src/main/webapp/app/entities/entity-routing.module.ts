import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'employer',
        data: { pageTitle: 'boostclientApp.employer.home.title' },
        loadChildren: () => import('./employer/employer.module').then(m => m.EmployerModule),
      },
      {
        path: 'employee',
        data: { pageTitle: 'boostclientApp.employee.home.title' },
        loadChildren: () => import('./employee/employee.module').then(m => m.EmployeeModule),
      },
      {
        path: 'quote',
        data: { pageTitle: 'boostclientApp.quote.home.title' },
        loadChildren: () => import('./quote/quote.module').then(m => m.QuoteModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
