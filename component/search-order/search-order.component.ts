import { Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Observable } from 'rxjs';
import { Display } from '@class/display';
import { map } from 'rxjs/operators';

export abstract class SearchOrderComponent {
  /**
   * Componente anidado para definir ordenamiento
   * Define un FormArray con elementos de ordenamiento.
   */

  @Input() form: FormGroup; 
  /**
   * Formulario
   */

  @Input() display$: Observable<Display>;
  /**
   * Datos iniciales
   */
  
  load$: Observable<any>;

  constructor(protected fb: FormBuilder) { }

  ngOnInit() {    
    this.initData();
  }

  initData() {
    this.load$ = this.display$.pipe(map(
      display => {
        this.initFieldset(display.getOrder())
        return display.getOrder()
      }
    ));
  }

  initFieldset(order: { [x: string]: string; }){
    let elementsFGs: Array<FormGroup> = [];
    for(let i in order) elementsFGs.push(this.formGroup(i, order[i]));
    this.form.setControl('order', this.fb.array(elementsFGs));
  }

  formGroup(k: string = "", v: string = "asc"): FormGroup {
    return this.fb.group({
      key:[k, {validators: [Validators.required]}],
      value:[v, {validators: [Validators.required]}],
    });
  }

  get elements(): FormArray { return this.form.get('order') as FormArray; }
  
  pushElement() { return this.elements.push(this.formGroup()) }
  
  unshiftElement() { return this.elements.controls.unshift(this.formGroup()) }
  
  removeElement(index: number) { return this.elements.removeAt(index); }

  k(i: number) { return this.elements.controls[i].get("key") }

  v(i: number) { return this.elements.controls[i].get("value") }

}
