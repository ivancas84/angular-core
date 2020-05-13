import { Component, Input } from '@angular/core';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';
import { FormGroup, FormBuilder } from '@angular/forms';


@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
})
export class UploadComponent {

  @Input() fieldName: string;

  @Input() fieldset: FormGroup;
  /**
   * Fieldset al que pertenece fieldName
   * Al cargar y procesar el archivo se asignara posteriormente el id resultante a fieldset.fieldName
   */

  @Input() type: string = "file";
  /**
   * Tipo de procesamiento
   * Permite seleccionar una alternativa entre diferentes controladores de procesamiento
   */

  constructor(private formBuilder: FormBuilder, private dd: DataDefinitionService) { }

  get field() { return this.fieldset.get(this.fieldName)}

  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append(this.type, file);
      this.field.markAsPending();
      this.dd.upload(formData).subscribe(
        (res) => {
          this.field.setValue(res);
          this.field.markAsDirty();
          // this.field.setErrors({'incorrect': true});
        },
        (err) => {  
          console.log(err);
        }
      );
    }
  }

}
