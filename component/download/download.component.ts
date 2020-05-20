import { Component, Input, AfterContentInit, OnInit, AfterViewInit } from '@angular/core';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Observable, of, ReplaySubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UPLOAD_URL } from 'src/app/app.config';


@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
})
export class DownloadComponent implements OnInit {

  readonly UPLOAD_URL = UPLOAD_URL;

  @Input() fieldName: string;

  @Input() fieldset: FormGroup;
  /**
   * Fieldset al que pertenece fieldName
   * Al cargar y procesar el archivo se asignara posteriormente el id resultante a fieldset.fieldName
   */

  valueChange$: ReplaySubject<any> = new ReplaySubject();

  constructor(private dd: DataDefinitionService) { }
 

  get field() { return this.fieldset.get(this.fieldName)}

  
  ngOnInit(){
    if(this.field.value){
      this.dd.get("file", this.field.value).subscribe(
        r => this.valueChange$.next(r)
      )
    }
    this.field.valueChanges.subscribe(
        value => {
          this.dd.get("file", value).subscribe(
            r => this.valueChange$.next(r)
          )
        }
    )
  }


}
