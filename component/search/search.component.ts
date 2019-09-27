import { Input, OnChanges, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbAccordion } from '@ng-bootstrap/ng-bootstrap';
import { Filter } from '@class/filter';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';


export abstract class SearchComponent implements OnChanges {
  /**
   * @todo Verificar implementacion de typeahead de formulario de administracion y copiar
   * @todo Verificar implementacion de date de formulario de administracion y copiar
   * @todo Implementar correctamente las fk en base a la pk
   */
  @Input() conditions: Array<any>;
  @Output() conditionsChange: EventEmitter <any> = new EventEmitter <any>();
  activeIds: string[] = [];

  //@ViewChild('acc') accordionComponent: NgbAccordion;

  searchForm: FormGroup;
  entity: string; //entidad principal del componente
  options: {} = null; //opciones para el formulario
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
      for(let i = 0; i < this.conditions.length; i++){
      let filter = {field:this.conditions[i][0], option:this.conditions[i][1], value:this.conditions[i][2]};
      filtersFGs.push(this.fb.group(filter));
    }
    const filtersFormArray = this.fb.array(filtersFGs);
    this.searchForm.setControl('filters', filtersFormArray);
  }

  onSubmit(): void {
    this.conditions = [];
    for(let i = 0; i < this.filters.controls.length; i++){
      if(this.v(i) !== undefined) this.conditions.push([this.f(i), this.o(i), this.v(i)]);
    }
    this.conditionsChange.emit();
    this.accordionComponent.collapseAll();
  }
}
