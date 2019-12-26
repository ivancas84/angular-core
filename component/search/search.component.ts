import { Input, OnChanges, Output, EventEmitter, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { Filter } from '@class/filter';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';
import { Observable, forkJoin } from 'rxjs';
import { isEmptyObject } from '@function/is-empty-object.function';

export abstract class SearchComponent implements OnInit {

  @Input() condition$: any;
  /**
   * condicion (conjunto de filtros)
   */ 

  @Input() aux$: any;
  /**
   * busqueda auxiliar
   */ 

  @Output() conditionChange: EventEmitter <any> = new EventEmitter <any>();
  /**
   * cambio en condicion (conjunto de filtros)
   */

  searchForm: FormGroup;
  /**
   * Formulario de busqueda
   */

  readonly entityName: string; 
  /**
   * entidad principal del componente  
   */
  
  options: Observable<any>; 
  /**
   * opciones para el formulario
   */

  initialized: boolean = false;
  /**
   * Flag de inicializacion 
   */

  constructor(protected fb: FormBuilder, protected dd: DataDefinitionService, protected router: Router)  {}

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

  setFilters(condition){
    let filtersFGs: Array<FormGroup> = [];
    for(let i = 0; i < condition.length; i++){
      let filter = {field:condition[i][0], option:condition[i][1], value:condition[i][2]};
      filtersFGs.push(this.fb.group(filter));
    }
    const filtersFormArray = this.fb.array(filtersFGs);
    this.searchForm.setControl('filters', filtersFormArray);
  }

  initOptions(): void {
    /**
     * sobrescribir si el formulario tiene opciones
     * asignarlas al atributo options
     */
  }

  ngOnInit() {
    console.log("ngOnInit");

    this.createForm();
    this.initOptions();
    this.initData();
  }

  initData() {
    this.condition$.subscribe(
      condition => {
        console.log(condition);
        var obs = [];
 
        for(let i = 0; i < condition.length; i++) {
          if((condition[i][0] == "id") && !isEmptyObject(condition[i][2])) {
            var ob = this.dd.getOrNull(this.entityName, condition[i][2]);
            obs.push(ob);
          }
        }
        if(obs.length){ forkJoin(obs).subscribe( () => this.setFilters(condition) ); }
        else { this.setFilters(condition) }

      }
    )
  }

  onSubmit(): void {
    var condition = [];
    for(let i = 0; i < this.filters.controls.length; i++){
      if(this.v(i) !== undefined) condition.push([this.f(i), this.o(i), this.v(i)]);
    }

    console.log(this.searchForm)

    this.conditionChange.emit(condition);
  }
}
