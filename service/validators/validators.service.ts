import { Injectable } from '@angular/core';
import { SessionStorageService } from '@service/storage/session-storage.service';
import { FormControl, ValidatorFn, AsyncValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { timer, of, Observable } from 'rxjs';
import { Display } from '@class/display';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';
import { mergeMap, map } from 'rxjs/operators';
import { ToastService } from '@service/ng-bootstrap/toast.service';

@Injectable({
  providedIn: 'root'
})
export class ValidatorsService {
  /**
   * Inicialmente se iban a crear funciones independientes para validación
   * Se opto por crear un servicio para poder importar otros servicios necesarios
   */

  constructor(protected dd: DataDefinitionService, protected storage: SessionStorageService, protected toast: ToastService) {}

  protected checkYear(year: string): ValidationErrors | null {
    if (year) {
      if(!/^[0-9]+$/.test(year)) return {nonNumeric:true}
      if(year.length != 4) return {notYear:true}
    }
    return null;
  }

  year(): ValidatorFn {
    /**
     * Validar año (nonNumeric, notYear)
     */
    return (control: AbstractControl): ValidationErrors | null => {
      return this.checkYear(control.value);
    }
  }

  maxYear(year: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      var validateYear = this.checkYear(control.value);
      if(validateYear) return validateYear;

      if (control.value) {
        switch(year){
          case "CURRENT_YEAR":
            var currentYear = new Date().getFullYear();
            if(parseInt(control.value) > currentYear) return {maxYear:true};
          break;
          default:
              if(parseInt(control.value) > parseInt(year)) return {maxYear:true};
        }
      }
      return null;
    } 
  }

  minYear(year: string): ValidatorFn {
    /**
     * anio minimo
     * minYear:"anio minimo permitido"
     */
    return (control: AbstractControl): ValidationErrors | null => {
      var validateYear = this.checkYear(control.value);
      if(validateYear) return validateYear;

      if (control.value) {
        switch(year){
          case "CURRENT_YEAR":
            var currentYear = new Date().getFullYear();
            if(parseInt(control.value) < currentYear) return {minYear:currentYear};
          break;
          default:
              if(parseInt(control.value) < parseInt(year)) return {minYear:year};
        }
      }
      return null;
    } 
  }

  typeaheadSelection(entityName: string): ValidatorFn { 
    /**
     * Validar seleccion en typeahead
     */
    return (control: FormControl): ValidationErrors | null => {
      const unselected = (control.value && this.storage.getItem(entityName+control.value) == null);
      return unselected ? { unselected: true } : null;
    }
  }

  unique(fieldName: string, entityName: string): AsyncValidatorFn {
    /**
     * Verificar campo unico
     * Se puede evitar el fieldName a traves de un metodo de busqueda
     * No se implementa de esta forma para reducir el procesamiento
     */
    return (control: FormControl): Observable<ValidationErrors | null> => {
      var display: Display = new Display;
      display.condition = [fieldName, "=", control.value];

      return timer(1000).pipe(
        mergeMap(()=> {
        return this.dd.idOrNull(entityName, display).pipe(
          map(
            id => {
              return (id && (id != control.parent.get("id").value)) ? { notUnique: true } : null
            }
          )
        );
      }))
    };
  }

  uniqueMultiple(entity: string, fields:Array<string>): AsyncValidatorFn {
    /**
     * Validar unicidad a traves de varios campos.
     * Ejemplo uniqueMultiple("comision",["division", "sede"]).
     * Se aplica al FormGroup que contiene los fields.
     */

    return (control: FormControl): Observable<ValidationErrors | null> => {
      let values: Array<any> = [];

      return timer(1000).pipe(
        mergeMap(()=> {
          for(let f in fields) values.push(control.get(fields[f]).value);          

          let filters = [];
          for(let i = 0; i < fields.length; i++) filters.push([fields[i], "=", values[i]]);
         
          let display: Display = new Display;
          display.condition = filters;

          return this.dd.idOrNull(entity, display).pipe(
            map(
              id => {
                return (id && (id != control.get("id").value)) ? { notUnique: id } : null;
              },
            )
          );
        
        }
      ))  
    }
  }
}
