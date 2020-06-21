import { Input, OnInit} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { fastClone } from '@function/fast-clone';
import { Router } from '@angular/router';
import { SessionStorageService } from '@service/storage/session-storage.service';

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

  readonly entityName: string; 
  /**
   * entidad principal del componente  
   * Utilizado solo para identificar el fieldset
   */
  
  fieldset: FormGroup; 
  /**
   * fieldset
   */

  protected subscriptions = new Subscription();
  /**
   * las subscripciones son almacenadas para desuscribirse (solucion temporal al bug de Angular)
   * @todo En versiones posteriores de angular, eliminar el atributo subscriptions y su uso
   */

   readonly defaultValues: {[key:string]: any} = {};

  constructor(
    protected router: Router, 
    protected storage: SessionStorageService, 
  ) { }

  abstract formGroup();

  formValues =this.storage.getItem(this.router.url);

  ngOnInit() {    
    /**
     * Al inicializar el formulario se blanquean los valores del storage, por eso deben consultarse previamente
     */
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
     * No suscribirse desde el template!
     * Puede disparar errores ExpressionChanged... no deseados (por ejemplo en la validacion inicial)
     * Al suscribirse desde el template se cambia el Lifehook cycle 
     */  
      var s = this.data$.subscribe(
        response => {
          if(this.formValues) {
            var d = this.formValues.hasOwnProperty(this.entityName)? this.formValues[this.entityName] : null;
            (d) ? this.fieldset.reset(d) : this.fieldset.reset();
            this.formValues = null;
          } else {
            this.initValues(response);
            /**
             * response puede tener el valor de algunos datos, por las dudas inicializo los valores por defecto
             */
          }
        }
      );
      this.subscriptions.add(s);
  }

  initValues(response: {[key:string]: any} = {}){
    if(!response) {
      this.fieldset.reset(this.defaultValues);
    } else {
      var res = fastClone(response);
      for(var key in this.defaultValues){
        if(this.defaultValues.hasOwnProperty(key)){
          if(!res.hasOwnProperty(key)) res[key] = this.defaultValues[key];
        }
      }
      this.fieldset.reset(res) 
    }
  }


 
}
