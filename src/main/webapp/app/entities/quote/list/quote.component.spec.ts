import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { QuoteService } from '../service/quote.service';

import { QuoteComponent } from './quote.component';

describe('Component Tests', () => {
  describe('Quote Management Component', () => {
    let comp: QuoteComponent;
    let fixture: ComponentFixture<QuoteComponent>;
    let service: QuoteService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [QuoteComponent],
      })
        .overrideTemplate(QuoteComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(QuoteComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(QuoteService);

      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.quotes?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
