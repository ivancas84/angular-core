import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Observable, of, ReplaySubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UPLOAD_URL } from 'src/app/app.config';


@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
})
export class DownloadComponent implements OnChanges {

  @Input() id: string;

  file: any = null;

  constructor(private dd: DataDefinitionService) { }
  
  ngOnChanges(changes: SimpleChanges){
    if( changes['id'] && changes['id'].previousValue != changes['id'].currentValue ) {
      this.dd.getOrNull("file", this.id).subscribe(
        row => {
          this.file = row;
          if(this.file) this.file["link"] = UPLOAD_URL+this.file.content; 
        }
      )
    }
  }

}
