import { ValidationErrors, FormGroup, FormArray } from "@angular/forms";

export function logValidationErrors(formGroup) {
    /**
     * log de errores del formulario
     * Utilizado opcionalmente para propositos de Debug
     */
    Object.keys(formGroup.controls).forEach(key => {

      const control = formGroup.get(key);

      if(control instanceof FormGroup ) {
        console.log("FormGroup " + key);

        const controls: ValidationErrors = formGroup.get(key).controls;
          Object.keys(controls).forEach(keyC => {
            if(controls[keyC].errors) {
              Object.keys(controls[keyC].errors).forEach(keyError => {
                console.log('* ERROR: ' + key + ' ('+keyC+'): ' + keyError + ':' + controls[keyC].errors[keyError]);
              })
            }            
          });
      }
      else if(control instanceof FormArray ) {
        console.log("FormArray " + key);

        for (let i = 0; i < control.controls.length; i++){
          console.log("+ index " + i);
          logValidationErrors(control.controls[i]);
        }
      }
    });
  }