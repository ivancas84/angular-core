import { Input, Output, EventEmitter, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export abstract class TableComponent  {
 
  readonly entityName: string; 
  /**
   * entidad principal
   */

  @Input() data$: BehaviorSubject<any> ; 
  /**
   * datos principales
   */
 
  @Output() orderChange: EventEmitter <any> = new EventEmitter <any>();
  @Output() deleteChange: EventEmitter <any> = new EventEmitter <any>();


  order(){ this.orderChange.emit(arguments); };

}
