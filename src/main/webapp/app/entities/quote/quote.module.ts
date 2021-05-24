import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { QuoteComponent } from './list/quote.component';
import { QuoteDetailComponent } from './detail/quote-detail.component';
import { QuoteUpdateComponent } from './update/quote-update.component';
import { QuoteDeleteDialogComponent } from './delete/quote-delete-dialog.component';
import { QuoteRoutingModule } from './route/quote-routing.module';

@NgModule({
  imports: [SharedModule, QuoteRoutingModule],
  declarations: [QuoteComponent, QuoteDetailComponent, QuoteUpdateComponent, QuoteDeleteDialogComponent],
  entryComponents: [QuoteDeleteDialogComponent],
})
export class QuoteModule {}
