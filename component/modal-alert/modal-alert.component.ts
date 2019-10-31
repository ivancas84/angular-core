import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-alert',
  templateUrl: './modal-alert.component.html'
})
export class ModalAlertComponent {
  @Input() title: string;
  @Input() message: string;
  @Input() status: string;

  constructor(public activeModal: NgbActiveModal) { }

}
