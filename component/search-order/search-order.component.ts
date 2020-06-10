import { Input, OnChanges, Output, EventEmitter, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';

import { Filter } from '@class/filter';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';
import { Observable, forkJoin, ReplaySubject } from 'rxjs';
import { isEmptyObject } from '@function/is-empty-object.function';
import { OrderElement } from '@class/orderElement';

export abstract class SearchOrderComponent {
  /**
   * Componente anidado.
   * Formulario para definir ordenamiento.
   * Define un FormArray con elementos de ordenamiento.
   * Similar a SearcConditionComponent.
   * Utiliza el elemento OrderElement.
   */

  @Input() form: FormGroup; 
  /**
   * Formulario
   */

  @Input() order$: ReplaySubject<any>;
  /**
   * Datos iniciales de ordenamiento: Mapa ordenado de {key:value}
   */
  
  fieldset: AbstractControl; 
  /**
   * fieldset
   */

  constructor(protected fb: FormBuilder) { }

  abstract formGroup();

  ngOnInit() {    
    this.form.addControl("order", this.fb.array([]));
    this.initData();
  }

  initData() {
    this.order$.subscribe(
      order => { this.setOrder(order) }
    )
  }

  setOrder(order){
    let orderElementsFGs: Array<FormGroup> = [];
    for(let i in order){
      let oe: OrderElement = {key:i, value:order[i]};
      orderElementsFGs.push(this.fb.group(oe));
    }
    const orderElementsFormArray = this.fb.array(orderElementsFGs);
    this.form.setControl('order', orderElementsFormArray);
  }

  
  get orderElements(): FormArray { return this.form.get('order') as FormArray; }
  addOrderElement() { return this.orderElements.push(this.fb.group(new OrderElement())); }
  removeOrderElement(index) { return this.orderElements.removeAt(index); }

  k(i) { return this.orderElements.controls[i].get("key").value }
  v(i) { return this.orderElements.controls[i].get("value").value }

}
