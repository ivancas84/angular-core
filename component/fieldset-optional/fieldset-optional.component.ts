import { FieldsetComponent } from '@component/fieldset/fieldset.component';
import { Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

export abstract class FieldsetOptionalComponent extends FieldsetComponent {

  @Input() data$: Observable<any>; 
  /**
   * Deberia heredarlo pero da error al ejecutar "ng s"
   * Se ve que solo resuelve hasta una superclase
   * @todo Conviene reemplazar el uso de FieldsetComponent y reimplementar todo en FieldsetOptional
   */

  @Input() form: FormGroup; 
  /**
   * Deberia heredarlo pero da error al ejecutar "ng s"
   * Se ve que solo resuelve hasta una superclase
   * @todo Conviene reemplazar el uso de FieldsetComponent y reimplementar todo en FieldsetOptional
   */
  
  initData(): void {
    /**
     * No suscribirse desde el template!
     * Puede disparar errores ExpressionChanged... no deseados (por ejemplo en la validacion inicial)
     * Al suscribirse desde el template se cambia el Lifehook cycle 
     */  
      var s = this.data$.subscribe(
        response => {
          if(this.formValues) {
            this.initValuesStorage();
          } else {
            this.initValues(response);
            (response) ? this.fieldset.enable() : this.fieldset.disable();
            /**
             * response puede tener el valor de algunos datos, por las dudas inicializo los valores por defecto
             */
          }
        }
      );
      this.subscriptions.add(s);
  }

  initValuesStorage() { 
    var d = this.formValues.hasOwnProperty(this.entityName)? this.formValues[this.entityName] : null;
    console.log(this.entityName);
    
    console.log(d);
    if(!d) {
      this.fieldset.reset();
      this.fieldset.disable();
    } else { 
      this.fieldset.reset(d);
      this.fieldset.enable();
    }
    this.formValues = null;
  }

  /*
  initValuesKey(key, response){
    if(response && response.hasOwnProperty(key) && response[key]) {
      this.dd.get(this.entityName, response[name]).pipe(first()).subscribe(
        res => {
          this.initValues(res);
          this.fieldset.enable()
        }
      )
    } else {
      this.fieldset.disable();
    }
  }*/
}
