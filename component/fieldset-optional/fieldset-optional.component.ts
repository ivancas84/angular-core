import { FieldsetComponent } from '@component/fieldset/fieldset.component';
import { Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

export abstract class FieldsetOptionalComponent extends FieldsetComponent {

  @Input() data$: any; 
  /**
   * Deberia heredarlo pero da error al ejecutar "ng s"
   * Se ve que solo resuelve hasta una superclase
   * @todo Conviene reemplazar el uso de FieldsetComponent y reimplementar todo en FieldsetOptional
   * Datos del formulario
   */

  @Input() form: FormGroup; 
  /**
   * Deberia heredarlo pero da error al ejecutar "ng s"
   * Se ve que solo resuelve hasta una superclase
   * @todo Conviene reemplazar el uso de FieldsetComponent y reimplementar todo en FieldsetOptional
   * Formulario de administracion
   */
  
  initData(): void{    
    this.data$.subscribe(
      response => {
        if(response) {
          this.fieldset.enable();
          this.fieldset.reset(response);
        } else {
          this.initValues();
          this.fieldset.disable(); 
        }        
      }
    );
  }
}
