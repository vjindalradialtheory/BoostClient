jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { QuoteService } from '../service/quote.service';
import { IQuote, Quote } from '../quote.model';
import { IEmployer } from 'app/entities/employer/employer.model';
import { EmployerService } from 'app/entities/employer/service/employer.service';

import { QuoteUpdateComponent } from './quote-update.component';

describe('Component Tests', () => {
  describe('Quote Management Update Component', () => {
    let comp: QuoteUpdateComponent;
    let fixture: ComponentFixture<QuoteUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let quoteService: QuoteService;
    let employerService: EmployerService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [QuoteUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(QuoteUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(QuoteUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      quoteService = TestBed.inject(QuoteService);
      employerService = TestBed.inject(EmployerService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Employer query and add missing value', () => {
        const quote: IQuote = { id: 456 };
        const employer: IEmployer = { id: 73128 };
        quote.employer = employer;

        const employerCollection: IEmployer[] = [{ id: 10431 }];
        spyOn(employerService, 'query').and.returnValue(of(new HttpResponse({ body: employerCollection })));
        const additionalEmployers = [employer];
        const expectedCollection: IEmployer[] = [...additionalEmployers, ...employerCollection];
        spyOn(employerService, 'addEmployerToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ quote });
        comp.ngOnInit();

        expect(employerService.query).toHaveBeenCalled();
        expect(employerService.addEmployerToCollectionIfMissing).toHaveBeenCalledWith(employerCollection, ...additionalEmployers);
        expect(comp.employersSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const quote: IQuote = { id: 456 };
        const employer: IEmployer = { id: 95380 };
        quote.employer = employer;

        activatedRoute.data = of({ quote });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(quote));
        expect(comp.employersSharedCollection).toContain(employer);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const quote = { id: 123 };
        spyOn(quoteService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ quote });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: quote }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(quoteService.update).toHaveBeenCalledWith(quote);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const quote = new Quote();
        spyOn(quoteService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ quote });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: quote }));
        saveSubject.complete();

        // THEN
        expect(quoteService.create).toHaveBeenCalledWith(quote);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const quote = { id: 123 };
        spyOn(quoteService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ quote });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(quoteService.update).toHaveBeenCalledWith(quote);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackEmployerById', () => {
        it('Should return tracked Employer primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackEmployerById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
