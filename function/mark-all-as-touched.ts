import { AbstractControl, FormControl } from '@angular/forms';

export function markAllAsTouched(control: AbstractControl) { 
    /**
     * Marcar todos los elementos del formulario como touched 
     * Util para visualizar errores
     */
      if(control.hasOwnProperty('controls')) {
          control.markAsTouched({ onlySelf: true }) // mark group
          let ctrl = <any>control;
          for (let inner in ctrl.controls) markAllAsTouched(ctrl.controls[inner] as AbstractControl);
      }
      else (<FormControl>(control)).markAsTouched({ onlySelf: true });
    }
  