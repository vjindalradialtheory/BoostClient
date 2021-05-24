import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { QuoteDetailComponent } from './quote-detail.component';

describe('Component Tests', () => {
  describe('Quote Management Detail Component', () => {
    let comp: QuoteDetailComponent;
    let fixture: ComponentFixture<QuoteDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [QuoteDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ quote: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(QuoteDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(QuoteDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load quote on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.quote).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
