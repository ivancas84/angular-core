import { Component, Input, SimpleChanges, OnChanges} from '@angular/core';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-label',
  templateUrl: './label.component.html',
})
export class LabelComponent implements OnChanges {
  
  @Input() entityName: string;
  @Input() id: string;

  label: string;
  constructor(private dd: DataDefinitionService) { }
  
  ngOnChanges(changes: SimpleChanges){
    if( changes['id'] && changes['id'].previousValue != changes['id'].currentValue ) {
      if(!changes['id'].currentValue) this.label = null;
      else {
        this.dd.labelGet(this.entityName, this.id).pipe(first()).subscribe(
          (label:string) => {this.label = label;}
        );
      }
    }
  }

}
