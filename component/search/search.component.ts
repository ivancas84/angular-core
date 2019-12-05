import { Input, OnChanges, Output, EventEmitter, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { Filter } from '@class/filter';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';
import { Observable, forkJoin } from 'rxjs';
import { isEmptyObject } from '@function/is-empty-object.function';

export abstract class SearchComponent implements OnInit {
  @Input() condition: Array<any>;
  /**
   * condicion (conjunto de filtros)
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

  initForm() {
    let filtersFGs: Array<FormGroup> = [];
    for(let i = 0; i < this.condition.length; i++){
      let filter = {field:this.condition[i][0], option:this.condition[i][1], value:this.condition[i][2]};
      filtersFGs.push(this.fb.group(filter));
    }
    const filtersFormArray = this.fb.array(filtersFGs);
    this.searchForm.setControl('filters', filtersFormArray);
  }

  initOptions(): void{
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

  initData() {
    var obs = [];
 
    for(let i = 0; i < this.condition.length; i++){
      if((this.condition[i][0] == "id") && !isEmptyObject(this.condition[i][2])) {
        var ob = this.dd.getOrNull("sede",this.condition[i][2]);
        obs.push(ob);
      }
    }
    if(obs.length){ forkJoin(obs).subscribe( () => this.initForm() ); }
    else { this.initForm() }
  }

  onSubmit(): void {
    this.condition = [];
    for(let i = 0; i < this.filters.controls.length; i++){
      if(this.v(i) !== undefined) this.condition.push([this.f(i), this.o(i), this.v(i)]);
    }

    this.conditionChange.emit(this.condition); 
  }
}
