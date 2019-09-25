import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { API_ROOT, HTTP_OPTIONS } from 'src/app/app.config';
import { SessionStorageService } from 'src/app/core/service/storage/session-storage.service';
import { Display } from '@class/display';
import { DataDefinition } from '@class/data-definition';
import { DataDefinitionLoaderService } from '@service/data-definition-loader.service';

@Injectable({
  providedIn: 'root'
})
export class DataDefinitionService {

  constructor(public http: HttpClient, public storage: SessionStorageService, public loader: DataDefinitionLoaderService) { }

  isSync(key, sync): boolean { return (!sync || !(key in sync) || sync[key]) ? true : false; }

  all (entity: string, display: Display = null): Observable<any> {
    let key = "_" + entity + "_all" + JSON.stringify(display.describe());
    if(this.storage.keyExists(key)) return of(this.storage.getItem(key));

    let url = API_ROOT + entity + '/all'
    return this.http.post<any>(url, display.describe(), HTTP_OPTIONS).pipe(
      tap(
        rows => {
          this.storage.setItem(key, rows);
  
          for(let i = 0; i < rows.length; i++){
            let ddi: DataDefinition = this.loader.get(entity);
            ddi.storage(rows[i]);
          }
        }
      )      
    );
  }

  count (entity: string, display: Display = null): Observable<any> {
    let key = "_" + entity + "_count" + JSON.stringify(display.describe());
    if(this.storage.keyExists(key)) return of(this.storage.getItem(key));

    let url = API_ROOT + entity + '/count'

    return this.http.post<any>(url, display.describe(), HTTP_OPTIONS).pipe(
      tap( res => this.storage.setItem(key, res) )
    );
  }

  labelGet (entity: string, id: string | number): string {
    /**
     * etiqueta de identificacion
     * los datos a utilizar deben estar en el storage
     */
    let row = this.storage.getItem(entity + id);
    if(!row) return null;
    return this.loader.get(entity).label(row, this);
  }

}