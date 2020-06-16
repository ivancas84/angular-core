import { Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, AbstractControl } from '@angular/forms';

import { Filter } from '@class/filter';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';
import { Observable } from 'rxjs';
import { Display } from '@class/display';
import { map } from 'rxjs/operators';

export abstract class SearchConditionComponent implements OnInit {
  /**
   * Componente anidado de Busqueda para definir busqueda a traves de condiciones 
   */

  @Input() form: FormGroup;
  /**
   * Formulario
   */
  
  @Input() display$: Observable<Display>;
  /**
   * Datos iniciales
   */
   

  @Input() condition$: Observable<Array<any>>;
  /**
   * Parametros de datos iniciales
   */

   fieldset: AbstractControl; 
  /**
   * fieldset
   */

  constructor(
    protected fb: FormBuilder, 
    protected dd: DataDefinitionService 
  )  {}

  ngOnInit() {
    this.initForm();
    this.initOptions();
    this.initData();
  }

  initForm(): void{
    this.fieldset = this.fb.array([]);
    this.form.addControl("filters", this.fieldset);
  }

  get filters(): FormArray { return this.form.get('filters') as FormArray; }
  addFilter() { return this.filters.push(this.fb.group(new Filter())); }
  removeFilter(index) { return this.filters.removeAt(index); }

  f(i) { return this.filters.controls[i].get("field") }
  o(i) { return this.filters.controls[i].get("option") }
  v(i) { return this.filters.controls[i].get("value")  }

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

  
  initData(): void{    
    /**
     * Inicializar datos
     * Los valores por defecto se definen en el componente principal que utiliza el formulario de busqueda
     * Puede resultar necesario inicializar valores que seran posteriormente accedidos desde el storage
     */
    
    this.condition$ = this.display$.pipe(map(
      display => {
        this.setFilters(display.getCondition())
        return display.getCondition()
      }
    ));
  }

}
