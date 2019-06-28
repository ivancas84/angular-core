import { Injectable } from '@angular/core';
import { SessionStorageService } from '../storage/session-storage.service';
import { DataDefinitionService } from '../../../service/data-definition/data-definition.service';
import { FormControl, ValidatorFn, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { timer, of } from 'rxjs';
import { Display } from '../../class/display';


@Injectable()
export class ValidatorsService {
  /**
   * Inicialmente se iban a crear funciones independientes para validación
   * Se opto por crear un servicio para poder importar otros servicios necesarios
   */

  constructor(protected dd: DataDefinitionService, protected storage: SessionStorageService) {}

  typeaheadSelection(entityName: string): ValidatorFn { //validar seleccion en typeahead
    return (control: FormControl): ValidationErrors | null => {
      const unselected = (control.value && this.storage.getItem(entityName+control.value) == null);
      return unselected ? { unselected: true } : null;
    }
  }

  unique(fieldName: string, entityName: string): AsyncValidatorFn { //verificar campo unico
    /**
     * Se puede evitar el fieldName a traves de un metodo de busqueda
     * No se implementa de esta forma para reducir el procesamiento
     */
    return (control: FormControl): Observable<ValidationErrors | null> => {
      var display: Display = new Display;
      display.filters = [fieldName, "=", control.value];

      return timer(1000).mergeMap(()=> {
        return this.dd.idOrNull(entityName, display).map(
          id => {
            return (id && (id != control.parent.get("id").value)) ? { notUnique: true } : null
          }
        );
      })
    };
  }

  unique_(entity: string, fields:Array<string>): AsyncValidatorFn { //validar unicidad a traves de varios campos
    return (control: FormControl): Observable<ValidationErrors | null> => {
      let values: Array<any> = [];

      return timer(1000).mergeMap(()=> {
        /**
         * Se define un timer iniciar para que se inicialicen los parametros
         * Al cargar el componente realiza una validacion inicial
         */


        for(let f in fields){
          let v = control.parent.get(fields[f]).value;
          if(!v) return of(null);
          values.push(v);
        }

        let filters = [];
        for(let i = 0; i < fields.length; i++){
          filters.push([fields[i], "=", values[i]]);
        }

        let display: Display = new Display;
        display.filters = filters;

        return this.dd.idOrNull(entity, display).map(
          id => {
            return (id && (id != control.parent.get("id").value)) ? { notUnique: id } : null
          }
        );
      })     
    }
  }
}
