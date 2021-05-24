import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { EmployerComponent } from './list/employer.component';
import { EmployerDetailComponent } from './detail/employer-detail.component';
import { EmployerUpdateComponent } from './update/employer-update.component';
import { EmployerDeleteDialogComponent } from './delete/employer-delete-dialog.component';
import { EmployerRoutingModule } from './route/employer-routing.module';

@NgModule({
  imports: [SharedModule, EmployerRoutingModule],
  declarations: [EmployerComponent, EmployerDetailComponent, EmployerUpdateComponent, EmployerDeleteDialogComponent],
  entryComponents: [EmployerDeleteDialogComponent],
})
export class EmployerModule {}
