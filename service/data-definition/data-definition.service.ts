import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SessionStorageService } from '../storage/session-storage.service';
import { Observable } from 'rxjs';
import { DataDefinitionLoaderService } from 'src/app/service/data-definition-loader.service';

@Injectable({
  providedIn: 'root'
})
export class DataDefinitionService {

  constructor(public http: HttpClient, public storage: SessionStorageService, public loader: DataDefinitionLoaderService) { }

  all (entity: string, display: Display = null): Observable<any> {
    let key = "_" + entity + "_all" + JSON.stringify(display);
    if(this.storage.keyExists(key)) return of(this.storage.getItem(key));

    let url = API_ROOT + entity + '/all'
    return this.http.post<any>(url, "display="+JSON.stringify(display), HTTP_OPTIONS).map(
      rows => {
        this.storage.setItem(key, rows);

        for(let i = 0; i < rows.length; i++){
          let ddi: DataDefinition = this.loader.get(entity);
          ddi.storage(rows[i]);
        }

        return rows;
      }
    );
  }

  count (entity: string, data: any = null): Observable<any> {
    let key = "_" + entity + "_count" + JSON.stringify(data);
    if(this.storage.keyExists(key)) return of(this.storage.getItem(key));

    let url = API_ROOT + entity + '/count'
    return this.http.post<any>(url, "display="+JSON.stringify(data), HTTP_OPTIONS).map(
      res => {
        this.storage.setItem(key, res);
        return res;
      }
    );
  }

}