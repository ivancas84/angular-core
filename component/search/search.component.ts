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

  @Input() search$: any;
  /**
   * Soporte para busqueda adicional (debe incluirse el componente en el html)
   */ 

  @Output() searchChange: EventEmitter <any> = new EventEmitter <any>();
  /**
   * evento de solicitud de busqueda
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

  constructor(protected fb: FormBuilder, protected dd: DataDefinitionService, protected router: Router)  {}

  createForm(){
    this.searchForm = this.fb.group({
      filters: this.fb.array([]),
    })
  }

  get search() { return this.searchForm.get(this.entityName); }
  /**
   * Busqueda adicional 
   * por defecto se define un subcomponente con el mismo nombre que la entidad 
   */

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
    this.createForm();
    this.initOptions();
    this.initData();
  }

  initFilters(condition){
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
    this.condition$.subscribe(
      condition => {
        var obs = this.initFilters(condition);
        if(obs.length){ forkJoin(obs).subscribe( () => this.setFilters(condition) ); }
        else { this.setFilters(condition) }
      }
    )
  }

  get condition():Array<any>{
    var condition = [];
    for(let i = 0; i < this.filters.controls.length; i++){
      if(this.v(i) !== undefined) condition.push([this.f(i), this.o(i), this.v(i)]);
    }
    return condition;
  }

  onSubmit(): void {
    var event = {}
    if(this.condition.length) event["condition"] = this.condition;
    if(this.search) event["search"] = this.search.value;
    
    this.searchChange.emit(event);
  }
}
