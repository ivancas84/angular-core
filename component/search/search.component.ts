import { Input, OnChanges, Output, EventEmitter, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { Filter } from '@class/filter';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';
import { Observable, forkJoin, ReplaySubject } from 'rxjs';
import { isEmptyObject } from '@function/is-empty-object.function';

export abstract class SearchComponent {

  @Input() condition$: any;
  /**
   * Busqueda a traves de condicion
   * implementacion opcional mediante componente SearchCondition
   */ 

  @Input() params$: ReplaySubject<any>;
  /**
   * Busqueda a traves de parametros
   * implementacion opcional mediante componente SearchParams
   */ 

  @Output() searchChange: EventEmitter <any> = new EventEmitter <any>();
  /**
   * evento de busqueda
   */

  readonly entityName: string; 
  /**
   * Entidad principal del componente  
   */
  
  searchForm: FormGroup = this.fb.group({});
  /**
   * Formulario de busqueda
   */

  constructor( protected fb: FormBuilder ) {}

  onSubmit(): void { this.searchChange.emit(this.searchForm.value); }
}
