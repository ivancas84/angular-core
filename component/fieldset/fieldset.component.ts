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

  readonly defaultValues: {[key:string]: any} = {};

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
        this.initValues(response);
        /**
         * response puede tener el valor de algunos datos, por las dudas inicializo los valores por defecto
         */ 
        /**
         * una vez reasignados los valores por defecto vuelgo a asignar valores (si existen)
         * esto va a realizar una doble definicion e valueChanges si se utilizan
         */ 
      }
    );
  }

  initValues(response: {[key:string]: any} = {}){
    if(!response) {
      this.fieldset.reset(this.defaultValues);
    } else {
      for(var key in this.defaultValues){
        if(this.defaultValues.hasOwnProperty(key)){
          if(!response.hasOwnProperty(key)) response[key] = this.defaultValues[key];
        }
      }
      this.fieldset.reset(response) 
    }
  }

    
 
}
