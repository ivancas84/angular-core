import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';


@Injectable()
export class SessionStorageService extends StorageService {


  getStorage(): any {
    return sessionStorage;
  }

}
