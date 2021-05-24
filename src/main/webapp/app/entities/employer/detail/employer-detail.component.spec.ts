import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EmployerDetailComponent } from './employer-detail.component';

describe('Component Tests', () => {
  describe('Employer Management Detail Component', () => {
    let comp: EmployerDetailComponent;
    let fixture: ComponentFixture<EmployerDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [EmployerDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ employer: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(EmployerDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(EmployerDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load employer on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.employer).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
