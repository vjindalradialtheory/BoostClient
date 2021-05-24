import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IEmployer } from '../employer.model';
import { EmployerService } from '../service/employer.service';
import { EmployerDeleteDialogComponent } from '../delete/employer-delete-dialog.component';

@Component({
  selector: 'jhi-employer',
  templateUrl: './employer.component.html',
})
export class EmployerComponent implements OnInit {
  employers?: IEmployer[];
  isLoading = false;

  constructor(protected employerService: EmployerService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.employerService.query().subscribe(
      (res: HttpResponse<IEmployer[]>) => {
        this.isLoading = false;
        this.employers = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IEmployer): number {
    return item.id!;
  }

  delete(employer: IEmployer): void {
    const modalRef = this.modalService.open(EmployerDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.employer = employer;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
