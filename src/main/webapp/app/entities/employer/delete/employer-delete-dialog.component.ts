import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IEmployer } from '../employer.model';
import { EmployerService } from '../service/employer.service';

@Component({
  templateUrl: './employer-delete-dialog.component.html',
})
export class EmployerDeleteDialogComponent {
  employer?: IEmployer;

  constructor(protected employerService: EmployerService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.employerService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
