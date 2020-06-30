import { Input, OnChanges, Output, EventEmitter, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, AbstractControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Filter } from '@class/filter';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';
import { Observable, forkJoin, ReplaySubject } from 'rxjs';
import { isEmptyObject } from '@function/is-empty-object.function';
import { OrderElement } from '@class/orderElement';
import { Display } from '@class/display';
import { map } from 'rxjs/operators';

export abstract class SearchOrderComponent {
  /**
   * Componente anidado para definir ordenamiento
   * Define un FormArray con elementos de ordenamiento.
   * Similar a SearchConditionComponent.
   * Utiliza el elemento OrderElement.
   */

  @Input() form: FormGroup; 
  /**
   * Formulario
   */

  @Input() display$: Observable<Display>;
  /**
   * Datos iniciales
   */
  
  @Input() order$: Observable<any>;
  /**
   * Datos iniciales de ordenamiento: Mapa ordenado de {key:value}
   */
  
  constructor(protected fb: FormBuilder) { }

  ngOnInit() {    
    this.initData();
  }

  initData() {
    this.order$ = this.display$.pipe(map(
      display => {
        this.initFieldset(display.getOrder())
        return display.getOrder()
      }
    ));
  }

  initFieldset(order){
    let orderElementsFGs: Array<FormGroup> = [];
    for(let i in order){
      let oe = {
        key:[i, {validators: [Validators.required]}],
        value:[order[i], {validators: [Validators.required]}],
      };
      orderElementsFGs.push(this.fb.group(oe));
    }
    const orderElementsFormArray = this.fb.array(orderElementsFGs);
    this.form.setControl('order', orderElementsFormArray);
  }

  get orderElements(): FormArray { return this.form.get('order') as FormArray; }
  addOrderElement() { return this.orderElements.push(this.fb.group(new OrderElement())); }
  removeOrderElement(index: number) { return this.orderElements.removeAt(index); }

  k(i: number) { return this.orderElements.controls[i].get("key") }
  v(i: number) { return this.orderElements.controls[i].get("value") }

}
