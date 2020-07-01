import { Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, AbstractControl, Validators } from '@angular/forms';

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
   
  load$: Observable<Array<any>>;
  
  constructor(
    protected fb: FormBuilder, 
    protected dd: DataDefinitionService 
  )  {}

  ngOnInit() {
    this.initOptions();
    this.initData();
  }

  get elements(): FormArray { return this.form.get('condition') as FormArray; }
  addFilter() { return this.elements.push(this.formGroup()); }
  removeFilter(index) { return this.elements.removeAt(index); }

  f(i) { return this.elements.controls[i].get("field") }
  o(i) { return this.elements.controls[i].get("option") }
  v(i) { return this.elements.controls[i].get("value")  }

  initFieldset(condition){
    let elementsFGs: Array<FormGroup> = [];
    for(let i = 0; i < condition.length; i++){
      let elFG = this.formGroup(condition[i][0], condition[i][1], condition[i][2]);
      elementsFGs.push(elFG);
    }
    this.form.setControl('condition', this.fb.array(elementsFGs));
  }

  formGroup(f: string = "", o: string ="=~", v: any = null): FormGroup {
    return this.fb.group({
      field: [f, {validators: [Validators.required]}],
      option: o,
      value: v,
    });
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
    
    this.load$ = this.display$.pipe(map(
      display => {
        this.initFieldset(display.getCondition())
        return display.getCondition()
      }
    ));
  }

}
