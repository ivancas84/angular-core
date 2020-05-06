import { Input, OnInit} from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder } from '@angular/forms';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';
import { ValidatorsService } from '@service/validators/validators.service';
import { isEmptyObject } from '@function/is-empty-object.function';
import { Observable, forkJoin, BehaviorSubject } from 'rxjs';
import { map, tap, delay } from 'rxjs/operators';

export abstract class FieldsetComponent implements  OnInit {
  /**
   * Componente de administración de fieldset. Características:
   *   El formulario y los datos son definidos en componente principal  
   *   Puede inicializar datos adicionales susceptibles de ser utilizados en componentes anidados
   */

  @Input() form: FormGroup; 
  /**
   * Formulario de administracion
   */

  @Input() data$: any; 
  /**
   * Datos del formulario
   */

  readonly entityName: string; 
  /**
   * entidad principal del componente  
   * Utilizado solo para identificar el fieldset
   */
  
  options: Observable<any>; 
  /**
   * opciones para el formulario
   */
  
  fieldset: AbstractControl; 
  /**
   * fieldset
   */

  //load$: BehaviorSubject<any> = new BehaviorSubject(false);

  constructor(
    protected fb: FormBuilder, 
    protected dd: DataDefinitionService, 
    protected validators: ValidatorsService
  ) { }

  abstract formGroup();

  ngOnInit() {    
    this.initForm();
    this.initOptions();
    this.initData();
  }

  initForm(): void {
    this.fieldset = this.formGroup();
    this.form.addControl(this.entityName, this.fieldset);
  }

  initOptions(): void {
    /**
     * sobrescribir si el formulario tiene opciones
     * asignarlas al atributo options
     */
  }

  initData(): void { 
    /**
     * sobrescribir si el fieldset tiene datos adicionales que deben ser inicializados     
     */   
    this.data$.subscribe(
      response => {
        this.setDefaultValues(); 
        if(!isEmptyObject(response)) { this.fieldset.reset(response) }
      }
    );
  }

  setDefaultValues(){
    /**
     * sobrescribir si el fieldset tiene valores por defecto
     * los valores por defecto deben definirse en una funcion independiente para facilitar su reutilizacion 
     * por ejemplo en el caso de limpiar el formulario a traves de un botón
     */
    this.fieldset.reset();
  }
 
}
