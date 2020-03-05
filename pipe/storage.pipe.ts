import { Pipe, PipeTransform } from '@angular/core';
import { SessionStorageService } from '@service/storage/session-storage.service';

@Pipe({name: 'storage'})
export class StoragePipe implements PipeTransform {
  constructor(protected stg: SessionStorageService) {}
  transform(value: string, entity: string): string { return this.stg.getItem(entity + value); }
}
