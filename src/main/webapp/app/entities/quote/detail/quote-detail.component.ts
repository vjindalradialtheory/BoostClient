import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IQuote } from '../quote.model';

@Component({
  selector: 'jhi-quote-detail',
  templateUrl: './quote-detail.component.html',
})
export class QuoteDetailComponent implements OnInit {
  quote: IQuote | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ quote }) => {
      this.quote = quote;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
