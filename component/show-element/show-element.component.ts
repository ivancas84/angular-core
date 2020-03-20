import { Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export abstract class ShowElementComponent  {

  @Input() data$: Observable<any>; 
  /**
   * datos principales
   */
 
  @Output() orderChange: EventEmitter <any> = new EventEmitter <any>();
  @Output() deleteChange: EventEmitter <any> = new EventEmitter <any>();

  order(params: Array<any>){ this.orderChange.emit(params); };

}
