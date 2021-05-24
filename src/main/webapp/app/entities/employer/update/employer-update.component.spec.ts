jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { EmployerService } from '../service/employer.service';
import { IEmployer, Employer } from '../employer.model';

import { EmployerUpdateComponent } from './employer-update.component';

describe('Component Tests', () => {
  describe('Employer Management Update Component', () => {
    let comp: EmployerUpdateComponent;
    let fixture: ComponentFixture<EmployerUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let employerService: EmployerService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [EmployerUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(EmployerUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(EmployerUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      employerService = TestBed.inject(EmployerService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const employer: IEmployer = { id: 456 };

        activatedRoute.data = of({ employer });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(employer));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const employer = { id: 123 };
        spyOn(employerService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ employer });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: employer }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(employerService.update).toHaveBeenCalledWith(employer);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const employer = new Employer();
        spyOn(employerService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ employer });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: employer }));
        saveSubject.complete();

        // THEN
        expect(employerService.create).toHaveBeenCalledWith(employer);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const employer = { id: 123 };
        spyOn(employerService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ employer });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(employerService.update).toHaveBeenCalledWith(employer);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
