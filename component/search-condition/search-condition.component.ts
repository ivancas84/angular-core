import { Input, OnChanges, Output, EventEmitter, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

import { Filter } from '@class/filter';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';
import { Observable, forkJoin } from 'rxjs';
import { isEmptyObject } from '@function/is-empty-object.function';

export abstract class SearchConditionComponent implements OnInit {
  readonly entityName: string; 
  /**
   * entidad principal del componente
   */
   
  @Input() data$: any;
  /**
   * condicion (conjunto de filtros)
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

  ngOnInit() {
    this.form.addControl("filters", this.fb.array([]));
    this.initOptions();
    this.initData();
  }

  initFilters(condition) {
    var obs = [];
 
    for(let i = 0; i < condition.length; i++) {
      if((condition[i][0] == "id") && !isEmptyObject(condition[i][2])) {
        var ob = this.dd.getOrNull(this.entityName, condition[i][2]);
        obs.push(ob);
      }
    }

    return obs;
  }

  initData() {
    this.data$.subscribe(
      condition => {
        var obs = this.initFilters(condition);
        if(obs.length){ forkJoin(obs).subscribe( () => this.setFilters(condition) ); }
        else { this.setFilters(condition) }
      }
    )
  }

}