import { FieldsetComponent } from '@component/fieldset/fieldset.component';
import { Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

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
     * sobrescribir si el fieldset tiene datos adicionales que deben ser inicializados 
     * se probo suscribirse desde el html, funciona pero tira error ExpressionChanged... 
     * no da tiempo a que se inicialice y enseguida se cambia el valor 
     */   
    var s = this.data$.subscribe(
      response => {
        this.initValues(response);
        (response) ? this.fieldset.enable() : this.fieldset.disable();
        return true;
      }
    );

    this.subscriptions.add(s);
  }

}
