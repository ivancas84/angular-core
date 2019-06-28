import { Component, Input, OnChanges, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import {NgbAccordion} from '@ng-bootstrap/ng-bootstrap';

import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { Display } from "../../class/display";
import { Filter } from "../../class/filter";

import { DataDefinitionService } from '../../../service/data-definition/data-definition.service';
import { Router } from '@angular/router';

export abstract class SearchComponent implements OnInit, OnChanges {
  /**
   * @todo Verificar implementacion de typeahead de formulario de administracion y copiar
   * @todo Verificar implementacion de date de formulario de administracion y copiar
   * @todo Implementar correctamente las fk en base a la pk
   */
  @Input() display: Display;
  @Output() changeSearch: EventEmitter <any> = new EventEmitter <any>();

  @ViewChild('acc') accordionComponent: NgbAccordion;

  searchForm: FormGroup;
  entity: string; //entidad principal del componente
  options: {} = null; //opciones para el formulario
  sync: Array<any> = null;

  constructor(protected fb: FormBuilder, protected dd: DataDefinitionService, protected router: Router)  {
    this.createForm();
  }

  createForm(){
    this.searchForm = this.fb.group({
      search: '',
      filters: this.fb.array([]),
    })
  }

  get filters(): FormArray { return this.searchForm.get('filters') as FormArray; }
  addFilter() { return this.filters.push(this.fb.group(new Filter())); }
  removeFilter(index) { return this.filters.removeAt(index); }

  //otbener field option y value de una determinada posicion
  f(i) { return this.filters.controls[i].get("field").value }
  o(i) { return this.filters.controls[i].get("option").value }
  v(i) { return this.filters.controls[i].get("value").value }

  assignFilter(field: any, option: any, value: any) { //asignar filtro al display de una determinada posicion
    var filter = [field, option, value];
    this.display.filters.push(filter);
  }

  ngOnInit() {
    //ngOnInit generalmente se utiliza para definir las opciones del formulario
    //cada formulario define sus propias opciones
  }

  ngOnChanges() {
    this.searchForm.get("search").setValue(this.display.search);
    let filtersFGs : Array<FormGroup> = this.initFilters();
    const filtersFormArray = this.fb.array(filtersFGs);
    this.searchForm.setControl('filters', filtersFormArray);
  }

  initFilters(): any[] { //transformacion de filtro a formulario
    /**
     * No se definen validadores, simplemente se asignan los valores al formulario definido en el template
     * Segun el nombre del field definido el template variara (es un formulario semidinamico)
     */
    let filtersFGs: FormGroup[] = [];
      for(let i = 0; i < this.display.filters.length; i++){
      let filter = {field:this.display.filters[i][0], option:this.display.filters[i][1], value:this.display.filters[i][2]};
      filtersFGs.push(this.fb.group(filter));
    }

    return filtersFGs;
  }

  setDisplay() {
    /**
     * el contenido del formulario se asigna a display
     * los cambios en display se reflejan en el padre
     */
    this.display.search = "";
    this.display.filters = [];
    for(let i = 0; i < this.filters.controls.length; i++){
      if(this.v(i) !== undefined) this.display.filters.push([this.f(i), this.o(i), this.v(i)]);
    }

    this.display.search = this.searchForm.get('search').value;
  }

  onSubmit(): void {
    this.setDisplay();
    this.changeSearch.emit();
    this.accordionComponent.collapseAll();
  }
}
