import { Input, OnInit} from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder } from '@angular/forms';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';
import { ValidatorsService } from '@service/validators/validators.service';

export abstract class FieldsetComponent implements  OnInit {
  /**
   * Componente de administración de fieldset. Características:
   *   El formulario y los datos son definidos en formulario (componente principal)  
   */

  @Input() form: FormGroup; 
  /**
   * Formulario de administracion
   */

  @Input() sync: any; 
  /**
   * Sincronizar de componentes
   */

  @Input() data$: any; 
  /**
   * Datos del formulario
   */

  entityName: string; 
  /**
   * entidad principal del componente  
   */

  fieldsetName: string; 
  /**
   * nombre del fieldset
   */
  
  options: {}; 
  /**
   * opciones para el formulario
   */
  
  fieldset: AbstractControl; 
  /**
   * fieldset
   */

  constructor(
    protected fb: FormBuilder, 
    protected dd: DataDefinitionService, 
    protected validators: ValidatorsService
  ) { }

  isSync(field: string){ return this.dd.isSync(field, this.sync); }

  abstract formGroup();

  ngOnInit() {
    this.fieldset = this.formGroup();
    this.form.addControl(this.fieldsetName, this.fieldset);
    this.initOptions();
    this.initData();
  }

  initOptions(){
    /**
     * sobrescribir si el formulario tiene opciones
     * this.options = this.dd.options(this.entityName, this.sync);
     */
  }

  initData(){
    this.data$.subscribe(
      response => { this.fieldset.reset(response); }
    );
  }

 
}