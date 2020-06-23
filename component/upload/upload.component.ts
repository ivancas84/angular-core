import { Component, Input, OnInit } from '@angular/core';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { UPLOAD_URL } from 'src/app/app.config';
import { SessionStorageService } from '@service/storage/session-storage.service';


@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
})
export class UploadComponent implements OnInit {

  @Input() field: FormControl;
  

  /**
   * Fieldset al que pertenece fieldName
   * Al cargar y procesar el archivo se asignara posteriormente el id resultante a fieldset.fieldName
   */

  @Input() readonly?: boolean = false;

  @Input() type?: string = "file";
  /**
   * Tipo de procesamiento
   * Permite seleccionar una alternativa entre diferentes controladores de procesamiento
   */

  fileControl: FormControl = new FormControl();
  
  file: any = null;

  protected subscriptions = new Subscription();

  constructor(protected dd: DataDefinitionService, protected storage: SessionStorageService) { }

 ngOnInit(): void {
    //if(this.field.value) this.initValue(this.field.value);

    var s = this.field.valueChanges.subscribe(
      value => this.initValue(value)
    );

    this.subscriptions.add(s);
  }

  initValue(value){
    this.dd.getOrNull("file", value).pipe(first()).subscribe(
      row => {
        if(row) {
          this.file = row;
          this.file["link"] = UPLOAD_URL+this.file.content; 
          this.fileControl.setValue("");
          this.fileControl.disable();
        } else {
          this.file = null;
          if(!this.readonly) this.fileControl.enable();
        }
      }
    );
  }

  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append(this.type, file);
      this.field.markAsPending();
      this.dd.upload(formData).subscribe(
        (res) => {
          this.storage.setItem("file" + res.id, res);
          this.field.setValue(res.id);
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
