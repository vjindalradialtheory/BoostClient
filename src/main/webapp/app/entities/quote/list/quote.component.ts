import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IQuote } from '../quote.model';
import { QuoteService } from '../service/quote.service';
import { QuoteDeleteDialogComponent } from '../delete/quote-delete-dialog.component';

@Component({
  selector: 'jhi-quote',
  templateUrl: './quote.component.html',
})
export class QuoteComponent implements OnInit {
  quotes?: IQuote[];
  isLoading = false;

  constructor(protected quoteService: QuoteService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.quoteService.query().subscribe(
      (res: HttpResponse<IQuote[]>) => {
        this.isLoading = false;
        this.quotes = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IQuote): number {
    return item.id!;
  }

  delete(quote: IQuote): void {
    const modalRef = this.modalService.open(QuoteDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.quote = quote;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
