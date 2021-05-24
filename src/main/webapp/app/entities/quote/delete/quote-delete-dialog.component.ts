import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IQuote } from '../quote.model';
import { QuoteService } from '../service/quote.service';

@Component({
  templateUrl: './quote-delete-dialog.component.html',
})
export class QuoteDeleteDialogComponent {
  quote?: IQuote;

  constructor(protected quoteService: QuoteService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.quoteService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
