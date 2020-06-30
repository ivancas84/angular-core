import {Component, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-confirm',
  templateUrl: './modal-confirm.component.html'
})
export class ModalConfirmComponent {
  @Input() title: string;
  @Input() message: string;

  constructor(public activeModal: NgbActiveModal) { }

}
