import { FormBuilder, FormGroup, AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/timer';

import { DataDefinitionService } from '../../../service/data-definition/data-definition.service';
import { Display } from '../../../core/class/display';

/*
DataDefinitionService para algunas entidades se debe aplicar un comportamiento habitual.
Es engorroso definir un servicio para cada entidad.
Se define una clase DataDefinition asociada al servicio.
*/
export abstract class DataDefinition {
  entity: string;

  constructor(protected dd: DataDefinitionService){ }

  abstract storage(row: { [index: string]: any }): void;
  options(sync: any): Observable<any> { return of(null); };  //sobrescribir solo si se definen opciones para la entidad

  //sobrescribir solo si la entidad se identifica con campos diferentes de id
  label (row: { [index: string]: any }): string {
    let ret = "";
    if (row["id"]) ret = ret + " " + row["id"];
    return ret;
  }

}
