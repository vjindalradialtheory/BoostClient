import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { EmployerService } from '../service/employer.service';

import { EmployerComponent } from './employer.component';

describe('Component Tests', () => {
  describe('Employer Management Component', () => {
    let comp: EmployerComponent;
    let fixture: ComponentFixture<EmployerComponent>;
    let service: EmployerService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [EmployerComponent],
      })
        .overrideTemplate(EmployerComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(EmployerComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(EmployerService);

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
      expect(comp.employers?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
