import { Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, AsyncValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Output, EventEmitter } from '@angular/core';
import { DataDefinitionService } from '../../../service/data-definition/data-definition.service';
import { ValidatorsService } from '../../service/validators/validators.service';
import { Display } from '../../class/display';
import 'rxjs/add/operator/map';
import { timer, empty, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export abstract class FieldsetComponent implements  OnInit {
  /**
   * Componente de administración de fieldset. Características:
   *   El formulario y los datos son definidos en formulario (componente principal)  
   */

  @Input() form: FormGroup; //formulario de administracion
  @Input() sync: any; //sincronizacion de componentes
  @Input() data$: any; //sincronizacion de componentes
  entityName: string; //entidad principal del componente  
  fieldsetName: string; //nombre del fieldset
  options: {}; //opciones para el formulario
  fieldset: AbstractControl; //fieldset

  constructor(protected fb: FormBuilder, protected dd: DataDefinitionService, protected validators: ValidatorsService) { }

  isSync(field: string){ return this.dd.isSync(field, this.sync); }

  abstract formGroup();

  ngOnInit() {
    this.fieldset = this.formGroup();
    this.form.addControl(this.fieldsetName, this.fieldset);
    this.options = this.dd.options(this.entityName, this.sync);
    this.initData();
  }

  initData(){
    this.data$.subscribe(
      response => { this.fieldset.reset(response); }
    );
  }

 
}
