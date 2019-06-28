import { Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import { Output, EventEmitter } from '@angular/core';
import { Entity } from '../../class/entity';
import { DataDefinitionService } from '../../../service/data-definition/data-definition.service';
import { ValidatorsService } from '../../service/validators/validators.service';

export abstract class FieldsetArrayComponent implements OnInit {
  /**
   * Diferencias con fieldset:
   *   Por cada entrada del FormArray se define un formGroup y se agrega al formulario
   *   Si se modifican los datos originales se eliminan todos los formGroup del array y se vuelven a crear
   */

  @Input() form: FormGroup; //formulario de administracion
  @Input() sync: any; //sincronizacion de componentes
  @Input() data$; //valores de campos que seran incluidos en el formulario
  entityName: string; //entidad principal del componente
  fieldsetName: string; //nombre del fieldset
  options: {} = null; //opciones para el formulario
  fieldset: FormArray; //fieldset

  constructor(protected fb: FormBuilder, protected dd: DataDefinitionService, protected validators: ValidatorsService) { }

  isSync(field: string){ return this.dd.isSync(field, this.sync); }

  abstract formGroup(values: { [index: string]: any }): void; //Definir estructura del formulario para cada elemento del form array

  addRow() {
    var entity = this.dd.loader.entity(this.entityName);
    this.formGroup(entity);
    this.form.markAsDirty()
  }

  removeRow(index){
    this.fieldset.removeAt(index);
    this.form.markAsDirty()
  }

  protected pushFormGroup(fg: FormGroup, values: { [index: string]: any } = null){
    var entity = this.dd.loader.entity(this.entityName);
    if(values !== null) Object.assign(entity, values);
    fg.reset(entity);
    this.fieldset.push(fg);
  }

  ngOnInit() {
    this.options = this.dd.options(this.entityName, this.sync);
    this.form.addControl(this.fieldsetName, this.fb.array([]));
    this.fieldset = this.form.get(this.fieldsetName) as FormArray;
    this.initData();
  }

  initData(){
    this.data$.subscribe(
      (values: { [index: string]: any; }[]) => {
        while (this.fieldset.length !== 0) this.fieldset.removeAt(0);
        if(values) {          
          for(let i = 0; i < values.length; i++) this.formGroup(values[i]);
        }
      }
    )
  }

}
