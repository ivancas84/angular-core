import { Input, Output, EventEmitter } from '@angular/core';

export abstract class TableComponent {
  readonly entity: string; 
  /**
   * entidad principal
   */

  @Input() data$: any; 
  /**
   * datos principales
   */
  
  @Output() orderChange: EventEmitter <any> = new EventEmitter <any>();
  @Output() deleteChange: EventEmitter <any> = new EventEmitter <any>();

  order(){ this.orderChange.emit(arguments); };

}
