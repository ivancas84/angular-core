import { FormBuilder, FormGroup } from '@angular/forms';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';
import { SearchParamsComponent } from '@component/search-params/search-params.component';
import { Component } from '@angular/core';

@Component({
  selector: 'app-search-all',
  templateUrl: './search-all.component.html',
})
export class SearchAllComponent extends SearchParamsComponent {
  
  constructor (
    protected fb: FormBuilder, 
    protected dd: DataDefinitionService
  ) { super(fb); }


  formGroup(): FormGroup {
    let fg: FormGroup = this.fb.group({
      _search: null
    });
    return fg;
  }
  
}
