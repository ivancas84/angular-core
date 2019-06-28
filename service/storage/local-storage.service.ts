import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';


@Injectable()
export class LocalStorageService extends StorageService {

  getStorage(): any {
    return localStorage;
  }

}
