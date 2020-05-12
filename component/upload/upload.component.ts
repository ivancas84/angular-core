import { Component, Output, Input, EventEmitter, OnInit } from '@angular/core';
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


  
   

  //@Input() type: string = "file";
  /**
   * Tipo de procesamiento
   * Permite seleccionar una alternativa entre diferentes controladores de procesamiento
   */

  @Input() name: string;
  /**
   * Identificador asignado para facilitar el procesamiento en el componente padre
   */

  form: FormGroup;
  /**
   * Formulario independiente, define un FormControl "file" necesario para que el usuario ingrese el archivo.
   * Una vez ingresado el archivo, se obtiene el valor del mismo y es asignado a un FormData para ser enviado al servidor 
   */

  constructor(private formBuilder: FormBuilder, private dd: DataDefinitionService) { 
    //this.form = this.formBuilder.group({
    //  file: ['']
    //});
  }

  get field() { return this.fieldset.get(this.fieldName)}

  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append('file', file);
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
      //this.form.get('file').setValue(file);
      //this.upload()
    }
  }

  upload() {
    const formData = new FormData();
    formData.append('file', this.form.get('file').value);

    this.dd.upload(formData).subscribe(
      (res) => {
        this.field.setValue(res)
      },
      (err) => {  
        console.log(err);
      }
    );
  }

}
