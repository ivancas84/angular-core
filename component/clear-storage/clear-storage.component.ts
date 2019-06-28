import { Component } from '@angular/core';
import { SessionStorageService } from '../../service/storage/session-storage.service';

@Component({
  selector: 'app-clear-storage',
  template: '<p>El storage ha sido limpiado</p>',
})
export class ClearStorageComponent {

  constructor(public storage: SessionStorageService) {
    storage.clear();
  }


}
