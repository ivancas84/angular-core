import { Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { Filter } from '@class/filter';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';

export abstract class SearchComponent implements OnChanges {
  @Input() condition: Array<any>;
  @Output() conditionChange: EventEmitter <any> = new EventEmitter <any>();

  searchForm: FormGroup;
  entity: string;
  options: {} = null;
  sync: Array<any> = null;

  constructor(protected fb: FormBuilder, protected dd: DataDefinitionService, protected router: Router)  {
    this.createForm();
  }

  createForm(){
    this.searchForm = this.fb.group({
      filters: this.fb.array([]),
    })
  }

  get filters(): FormArray { return this.searchForm.get('filters') as FormArray; }
  addFilter() { return this.filters.push(this.fb.group(new Filter())); }
  removeFilter(index) { return this.filters.removeAt(index); }

  f(i) { return this.filters.controls[i].get("field").value }
  o(i) { return this.filters.controls[i].get("option").value }
  v(i) { return this.filters.controls[i].get("value").value }

  ngOnChanges() {
    let filtersFGs: Array<FormGroup> = [];
    for(let i = 0; i < this.condition.length; i++){
      let filter = {field:this.condition[i][0], option:this.condition[i][1], value:this.condition[i][2]};
      filtersFGs.push(this.fb.group(filter));
    }
    const filtersFormArray = this.fb.array(filtersFGs);
    this.searchForm.setControl('filters', filtersFormArray);
  }

  onSubmit(): void {
    this.condition = [];
    for(let i = 0; i < this.filters.controls.length; i++){
      if(this.v(i) !== undefined) this.condition.push([this.f(i), this.o(i), this.v(i)]);
    }

    this.conditionChange.emit(this.condition); 
  }
}
