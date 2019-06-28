import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { forkJoin } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';

import { SessionStorageService } from '../storage/session-storage.service';
import { ParserService } from '../parser/parser.service';
import { MessageService } from '../message/message.service';


import { HTTP_OPTIONS, API_ROOT } from '../../../app.config';
import { LoaderService } from '../../../service/loader.service';
import { Display } from '../../class/display';
import { DataDefinition } from './data-definition';


export class DataDefinitionMainService {

  constructor(public fb: FormBuilder, public http: HttpClient, public storage: SessionStorageService, public loader: LoaderService, public parser: ParserService, public message: MessageService) { }

  uniqueId(): string {
    let start = new Date().getTime();
    while (new Date().getTime() < start + 1); //esperar un microsegundo para evitar colisiones en caso de multiples llamados al metodo

    let date = Date.now().toString();
    let number =  (Math.floor(Math.random()*10000)).toString(); //numero aleatorio de 4 posisiones
    if ( (4 - number.length) > 0 ) number = "0" + number;
    return date+number;
  }

  //field sincronizado? Un field se considera "sincronizado" si es estrictamente distinto de false
  //@todo deprecated reemplazar por funcion
  isSync(key, sync): boolean { return (!sync || !(key in sync) || sync[key]) ? true : false; }

  isEmpty(obj: any) { //@todo deprecated reemplazar por funcion
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
  }

  options(entity, sync): Observable<any> {
    /**
     * @todo Metodo obsoleto, cada componente definira sus propias opciones utilizando entitiesAll
     * Se debe reemplazar el uso del metodo y eliminarlo
     */
    let ddi: DataDefinition = this.loader.dataDefinition(entity, this);
    return ddi.options(sync);
  }

  entitiesAll(entities: string[]): Observable<any> { //obtener conjunto de datos de entidades
    let obs = [];
    for(let i = 0; i < entities.length; i++){
      var ob = this.all(entities[i]);
      obs.push(ob);
    }

    return forkJoin(obs).map(
      response => {
        var ret = {};
        for(let i = 0; i < entities.length; i++) ret[entities[i]] = response[i];
        return ret;
      }
    )
  }

  all (entity: string, display: Display = null): Observable<any> {
    let key = "_" + entity + "_all" + JSON.stringify(display);
    if(this.storage.keyExists(key)) return of(this.storage.getItem(key));

    let url = API_ROOT + entity + '/all'
    return this.http.post<any>(url, "display="+JSON.stringify(display), HTTP_OPTIONS).map(
      rows => {
        this.storage.setItem(key, rows);

        for(let i = 0; i < rows.length; i++){
          let ddi: DataDefinition = this.loader.dataDefinition(entity, this);
          ddi.storage(rows[i]);
        }

        return rows;
      }
    );
  }

  allField (entity: string, field: string, display: Display = null): Observable<any> { //retornar array correspondiente a un unico field
    /**
     * Puede ser el field correspondiente a una relacion determinada por cadena de alias
     * No se aplica json al field retornado
     * @todo No implementado en el servidor
     */
    let key = "_" + entity + "_allField" + JSON.stringify(display);
    if(this.storage.keyExists(key)) return of(this.storage.getItem(key));

    let url = API_ROOT + entity + '/allField'
    return this.http.post<any>(url, "display="+JSON.stringify(display)+"fields="+field, HTTP_OPTIONS).map(
      response => {
        this.storage.setItem(key, response);

        return response;
      }
    );
  }

  get (entity: string, id: string|number): Observable<any> {
    if(!id) throw("id es nulo");
    return this.getAll(entity, [id]).mergeMap(
      rows => {
        if(rows.length > 1) throw("La consulta retorno mas de un registro");
        if(rows.length == 0) throw("La consulta no retorno registro");
        return of(rows[0]);
      }
    )
  }

  getOrNull (entity: string, id: string|number): Observable<any>  {
    if(!id) return of(null);

    return this.getAll(entity, [id]).mergeMap(
      rows => {
        if(rows.length > 1) throw("La consulta retorno mas de un registro");
        return (rows.length != 1) ? of(null) : of(rows[0]);
      }
    )
  }

  getAll (entity: string, ids: any): Observable<any> { //datos a partir de ids
    /**
     * Recibe una lista de ids, y retorna sus datos rdenados en el mismo orden que se reciben los ids
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
      if(!data) searchIds.push(ids[i]); //BUG: SI ES BOOLEAN FALSE?
    }


    if (searchIds.length > 0) {
      //let key = "_" + entity + "_getAll" + JSON.stringify(searchIds);
      //if(this.storage.keyExists(key)) return of(this.storage.getItem(key));

      let url: string = API_ROOT + entity + '/getAll';
      return this.http.post<any>(url, "ids="+JSON.stringify(searchIds), HTTP_OPTIONS).map(
        rows_ => {
          for(let i = 0; i < rows_.length; i++){
            let ddi: DataDefinition = this.loader.dataDefinition(entity, this);
            ddi.storage(rows_[i]);
            let i_string: string = String(rows_[i].id);
            let i_int: number = parseInt(i_string);
            let j: string | number = ids.indexOf(i_string);
            if(j == -1){ j = ids.indexOf(i_int); } //BUG: chequear por ambos tipos
            rows[j] = rows_[i];
          }

          return rows;
        }


        );
    } else {
      return of(rows);
    }
  }

  ids (entity: string, display: Display = null): Observable<any> {
    let key = "_" + entity + "_ids" + JSON.stringify(display);
    if(this.storage.keyExists(key)) return of(this.storage.getItem(key));

    let url = API_ROOT + entity + '/ids'
    return this.http.post<any>(url, "display="+JSON.stringify(display), HTTP_OPTIONS).map(
      ids => {
        this.storage.setItem(key, ids);
        return ids;
      }
    );
  }

  idOrNull (entity: string, display: Display = null): Observable<any> {
    return this.ids(entity, display).mergeMap(
      ids => {
        if(ids.length > 1) throw("La consulta retorno mas de un registro");
        return (ids.length != 1) ? of(null) : of(ids[0]);
      }
    )
  }

  one (entity:string, display: Display = null): Observable<any> {
    return this.oneOrNull(entity, display).mergeMap(
      row => {
        if(!row) throw("La consulta no retorno registros");
        return row;
      }
    )
  }

  oneOrNull (entity:string, display: Display = null): Observable<any> {
    return this.all(entity, display).map(
      rows => {
        if(rows.length > 1) throw("La consulta retorno mas de un registro");
        if(rows.length == 0) return null;
        return rows[0];
      }
    )
  }

  uniqueOrNull(entity: string, params): Observable<any> {
    if(!params) return of(null);
    let key = "_" + entity + "_unique" + JSON.stringify(params);
    if(this.storage.keyExists(key)) return of(this.storage.getItem(key));

    let url = API_ROOT + entity + '/unique'
    return this.http.post<any>(url, "display="+JSON.stringify(params), HTTP_OPTIONS).map(
      row => {
        this.storage.setItem(key, row);
        return row;
      }
    );
  }

  unique(entity: string, params): Observable<any> {
    let key = "_" + entity + "_unique" + JSON.stringify(params);
    if(this.storage.keyExists(key)) return of(this.storage.getItem(key));

    let url = API_ROOT + entity + '/unique'
    return this.http.post<any>(url, "display="+JSON.stringify(params), HTTP_OPTIONS).map(
      row => {
        if(!row) throw("La consulta no retorno registros");
        this.storage.setItem(key, row);
        return row;
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

  labelGet (entity: string, id: string | number): string { //obtener etiqueta de identificacion
    /**
     * Este metodo requiere que los datoas a utilizar se encuentren obligatoriamente en el storage
     */
    let row = this.storage.getItem(entity + id);
    if(!row) return null;
    return this.loader.dataDefinition(entity, this).label(row);
  }

  checkTransaction(){
    let url = API_ROOT + 'system/checkTransaction'
    return this.http.get<any>(url).map(
      response => {
        if(!response["data"] || response["data"] == "null") return null;
 
        if(response["data"] == "CLEAR"){  this.storage.clear(); }

        else if(response["data"]) {
         this.storage.removeItems(response["data"]);
         this.storage.removeItemsPrefix("_");
        }
        return response["data"];
      }
    );
  }

  process(data: any[]){ //datos a ser procesados
    /**
     * retorna array con los ids persistidos
     */
    let url = API_ROOT + 'system/process'

    return this.http.post<any>(url, "data="+encodeURIComponent(JSON.stringify(data)), HTTP_OPTIONS).map(
      response => {
        console.log(response);
        this.message.add("Se efectuado un registro de datos");
        return response;
      }
    )
  }

  delete(entity:string, id:string|number): Observable<any> { //eliminar
    let url = API_ROOT + entity + '/delete'

    return this.http.post<any>(url, "id="+JSON.stringify(id), HTTP_OPTIONS).map(
      response => {
        if(response.status) this.message.add("Se ha eliminado " + entity);
        else this.message.add("No se puede eliminar " + entity + ": " + response.message)
        return response;
      }
    )
  }

  action (source: string, entity: string, data: any = null): Observable<any> { //ejecutar determinada accion correspondiente a una entidad
    /**
     * reemplazar display por data, no se envia un display sino cualquier dato
     */
    let key = "_" + entity + "_" + source + JSON.stringify(data);
    if(this.storage.keyExists(key)) return of(this.storage.getItem(key));

    let url = API_ROOT + entity + '/' + source;
    return this.http.post<any>(url, "data="+JSON.stringify(data), HTTP_OPTIONS).map(
      rows => {
        this.storage.setItem(key, rows);
        return rows;
      }
    );
  }

}