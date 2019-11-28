import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, map, first, mergeMap } from 'rxjs/operators';

import { API_ROOT, HTTP_OPTIONS } from 'src/app/app.config';
import { SessionStorageService } from 'src/app/core/service/storage/session-storage.service';
import { Display } from '@class/display';
import { DataDefinition } from '@class/data-definition';
import { DataDefinitionLoaderService } from '@service/data-definition-loader.service';
import { MessageService } from '@service/message/message.service';
import { ParserService } from '@service/parser/parser.service';

@Injectable({
  providedIn: 'root'
})
export class DataDefinitionService {

  constructor(
    protected http: HttpClient, 
    protected storage: SessionStorageService, 
    protected loader: DataDefinitionLoaderService,
    protected message: MessageService, 
    protected parser: ParserService,
  ) { }

  isSync(key, sync): boolean { return (!sync || !(key in sync) || sync[key]) ? true : false; }

  all (entity: string, display: Display = null): Observable<any> {
    let key = entity + ".all" + JSON.stringify(display.describe());
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
    let key = entity + ".count" + JSON.stringify(display.describe());
    if(this.storage.keyExists(key)) return of(this.storage.getItem(key));

    let url = API_ROOT + entity + '/count'

    return this.http.post<any>(url, display.describe(), HTTP_OPTIONS).pipe(
      tap( res => this.storage.setItem(key, res) )
    );
  }

  _getAll(entity: string, ids: Array<string | number>) {
    /**
     * Metodo complementario para buscar a traves de un array de ids
     */
    if(!ids.length) return of([]);

    let url: string = API_ROOT + entity + '/getAll';
    return this.http.post<any>(url, ids, HTTP_OPTIONS);
  }

  getAll (entity: string, ids: Array<string | number>): Observable<any> { 
    /**
     * Recibe una lista de ids, y retorna sus datos en el mismo orden que se reciben los ids
     * Procedimiento:
     *   Se define un array del tamanio del array de ids recibido
     *   Se define un nuevo array "rows" con los valores a retornar
     *   Se busca la coincidencia del id en el storage, y se asigna en la posicion correspondiente de rows
     *   Si no existe coincidencia se define un nuevo array "searchIds" con los ids a buscar en el servidor
     *   Se realiza una consulta al servidor con searchIds y se obtiene un "rows_" auxiliar
     *   Se recorre el resultado de la consulta comparando el id de "rows_" con el id de ids para obtener la posicion corresopndiente
     *   Se carga el resultado de rows_ en la posicion correspondiente
     */
    let rows: Array<{ [index: string]: boolean|string|number }> = new Array(ids.length);

    let searchIds: Array<string | number> = new Array();

    for(let i = 0; i < ids.length; i++) {
      let data: { [index: string]: boolean|string|number }  = this.storage.getItem(entity + ids[i]);

      rows[i] = data;
      if(!data) searchIds.push(ids[i]);
    }

    return this._getAll(entity, searchIds).pipe(
      map(rows_ => {
        rows_.forEach(element => {
          let ddi: DataDefinition = this.loader.get(entity);
          ddi.storage(element);
          let i_string: string = String(element.id);
          let i_int: number = parseInt(i_string);
          let j: string | number = ids.indexOf(i_string);
          if(j == -1){ j = ids.indexOf(i_int); } //BUG: chequear por ambos tipos
          rows[j] = element;
        })
        return rows;
      }
    ))
  }
  
  get (entity: string, id: string|number): Observable<any> {
    if(!id) throw("id es nulo");
    return this.getAll(entity, [id]).pipe(
      map(rows => {
        if(rows.length > 1) throw("La consulta retorno mas de un registro");
        if(rows.length == 0) throw("La consulta no retorno registro");
        return rows[0];
      })
    )
  }

  getOrNull (entity: string, id: string|number): Observable<any>  {
    if(!id) return of(null);

    return this.getAll(entity, [id]).pipe(
      mergeMap(
        rows => {
          if(rows.length > 1) throw("La consulta retorno mas de un registro");
          return (rows.length != 1) ? of(null) : of(rows[0]);
        }
      )
    );
  }

  ids (entity: string, display: Display = null): Observable<any> {
    let key = entity + ".ids" + JSON.stringify(display);
    if(this.storage.keyExists(key)) return of(this.storage.getItem(key));

    let url = API_ROOT + entity + '/ids'
    return this.http.post<any>(url, display, HTTP_OPTIONS).pipe(
      map(
        ids => {
          this.storage.setItem(key, ids);
          return ids;
        }
      )
    );
  }

  idOrNull (entity: string,  display: Display): Observable<any> {
    return this.ids(entity, display).pipe(
      map(rows => {
        if(rows.length > 1) throw("La consulta retorno mas de un registro");
        if(rows.length == 0) return null;
        return rows[0];
      })
    )
  }


  label (entity: string, id: string | number): string {
    /**
     * Etiqueta de identificacion
     * Los datos a utilizar deben estar en el storage
     */
    return this.loader.get(entity).label(id);
  }

  labelGet (entity: string, id: string | number): Observable<string> {
    /**
     * Etiqueta de identificacion
     */
    return this.get(entity, id).pipe(
      map( row => { return this.label(entity, id)} )
    )
  }

  uniqueOrNull(entity: string, params): Observable<any> {
    if(!params) return of(null);
    let key = entity + ".unique" + JSON.stringify(params);
    if(this.storage.keyExists(key)) return of(this.storage.getItem(key));

    let url = API_ROOT + entity + '/unique'
    return this.http.post<any>(url, params, HTTP_OPTIONS).pipe(
      map(
        row => {
          this.storage.setItem(key, row);
          return row;
        }
      )
    );
  }

  persist(entity: string, data: any[]){
    /**
     * Datos a ser procesados.
     * Retorna array con los ids persistidos.
     */
    let url = API_ROOT + entity + '/persist'

    return this.http.post<any>(url, data, HTTP_OPTIONS).pipe(
      map(
        response => {
          console.log(response);
          //this.message.add("Se efectuado un registro de datos");
          return response;
        }
      )
    )
  }

}
