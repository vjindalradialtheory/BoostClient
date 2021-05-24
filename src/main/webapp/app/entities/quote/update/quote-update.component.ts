import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IQuote, Quote } from '../quote.model';
import { QuoteService } from '../service/quote.service';
import { IEmployer } from 'app/entities/employer/employer.model';
import { EmployerService } from 'app/entities/employer/service/employer.service';

@Component({
  selector: 'jhi-quote-update',
  templateUrl: './quote-update.component.html',
})
export class QuoteUpdateComponent implements OnInit {
  isSaving = false;

  employersSharedCollection: IEmployer[] = [];

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    quoteDate: [null, [Validators.required]],
    employer: [null, Validators.required],
  });

  constructor(
    protected quoteService: QuoteService,
    protected employerService: EmployerService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ quote }) => {
      this.updateForm(quote);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const quote = this.createFromForm();
    if (quote.id !== undefined) {
      this.subscribeToSaveResponse(this.quoteService.update(quote));
    } else {
      this.subscribeToSaveResponse(this.quoteService.create(quote));
    }
  }

  trackEmployerById(index: number, item: IEmployer): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IQuote>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(quote: IQuote): void {
    this.editForm.patchValue({
      id: quote.id,
      name: quote.name,
      quoteDate: quote.quoteDate,
      employer: quote.employer,
    });

    this.employersSharedCollection = this.employerService.addEmployerToCollectionIfMissing(this.employersSharedCollection, quote.employer);
  }

  protected loadRelationshipsOptions(): void {
    this.employerService
      .query()
      .pipe(map((res: HttpResponse<IEmployer[]>) => res.body ?? []))
      .pipe(
        map((employers: IEmployer[]) =>
          this.employerService.addEmployerToCollectionIfMissing(employers, this.editForm.get('employer')!.value)
        )
      )
      .subscribe((employers: IEmployer[]) => (this.employersSharedCollection = employers));
  }

  protected createFromForm(): IQuote {
    return {
      ...new Quote(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      quoteDate: this.editForm.get(['quoteDate'])!.value,
      employer: this.editForm.get(['employer'])!.value,
    };
  }
}
