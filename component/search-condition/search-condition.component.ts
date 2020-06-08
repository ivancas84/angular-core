import { Input, OnChanges, Output, EventEmitter, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

import { Filter } from '@class/filter';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';
import { Observable, forkJoin } from 'rxjs';
import { isEmptyObject } from '@function/is-empty-object.function';

export abstract class SearchConditionComponent implements OnInit {
  @Input() condition$: any;
  /**
   * Conjunto de elementos similares a los filtros, organizados como array
   * Cada elemento es un array de la forma [campo, opcion, valor]
   */ 

  @Input() form: FormGroup;
  /**
   * Formulario de busqueda
   */
  
  options: Observable<any>; 
  /**
   * opciones para el formulario
   */

  constructor(
    protected fb: FormBuilder, 
    protected dd: DataDefinitionService 
  )  {}

  ngOnInit() {
    this.form.addControl("filters", this.fb.array([]));
    this.initOptions();
    this.initData();
  }

  get filters(): FormArray { return this.form.get('filters') as FormArray; }
  addFilter() { return this.filters.push(this.fb.group(new Filter())); }
  removeFilter(index) { return this.filters.removeAt(index); }

  f(i) { return this.filters.controls[i].get("field").value }
  o(i) { return this.filters.controls[i].get("option").value }
  v(i) { return this.filters.controls[i].get("value").value }

  setFilters(condition){
    let filtersFGs: Array<FormGroup> = [];
    for(let i = 0; i < condition.length; i++){
      let filter = {field:condition[i][0], option:condition[i][1], value:condition[i][2]};
      filtersFGs.push(this.fb.group(filter));
    }
    const filtersFormArray = this.fb.array(filtersFGs);
    this.form.setControl('filters', filtersFormArray);
  }

  initOptions(): void {
    /**
     * sobrescribir si el formulario tiene opciones
     * asignarlas al atributo options
     */
  }


  initData() {
    this.condition$.subscribe(
      condition => { this.setFilters(condition) }
    )
  }

}
