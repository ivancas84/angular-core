import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmComponent } from '@component/modal-confirm/modal-confirm.component';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  messages: string[] = [];

  constructor(protected modalService: NgbModal) {}

  // open(message) {
  //   const modalRef = this.modalService.open(ModalConfirmComponent);
  //   modalRef.componentInstance.label = message;
  // }


  add(message: string) {
    if (this.messages.length == 3) this.messages.pop();
    this.messages.unshift(message);
    //this.open(message);
  }

  remove(index) {
    this.messages.splice(index, 1);
  }

  clear() {
    this.messages = [];
  }
}
