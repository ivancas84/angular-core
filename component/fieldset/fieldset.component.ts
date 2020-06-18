import { Input, OnInit} from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder } from '@angular/forms';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';
import { ValidatorsService } from '@service/validators/validators.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

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

  @Input() data$: Observable<any>; 
  /**
   * Datos del formulario
   */

  load$: Observable<any>; 
   

  readonly entityName: string; 
  /**
   * entidad principal del componente  
   * Utilizado solo para identificar el fieldset
   */
  
  fieldset: FormGroup; 
  /**
   * fieldset
   */

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
     */
  }

  initData(): void { 
    /**
     * sobrescribir si el fieldset tiene datos adicionales que deben ser inicializados 
     * se probo suscribirse desde el html, funciona pero tira error ExpressionChanged... 
     * no da tiempo a que se inicialice y enseguida se cambia el valor 
     */   
    this.load$ = this.data$.pipe(map(
      response => {
        console.log(response);
        this.initValues(response);
        return true;
        /**
         * response puede tener el valor de algunos datos, por las dudas inicializo los valores por defecto
         */
      }
    ));
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
