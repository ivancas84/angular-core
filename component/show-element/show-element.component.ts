import { Input, Output, EventEmitter, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export abstract class ShowElementComponent  {

  @Input() data$: any ; 
  /**
   * datos principales
   */
 
  @Output() orderChange: EventEmitter <any> = new EventEmitter <any>();
  @Output() deleteChange: EventEmitter <any> = new EventEmitter <any>();

  order(){ this.orderChange.emit(arguments); };

}
