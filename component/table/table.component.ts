import { Input, Output, EventEmitter, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export abstract class TableComponent implements OnInit {
 
  readonly entity: string; 
  /**
   * entidad principal
   */

  @Input() data$: any; 
  /**
   * datos principales
   */

  @Input() load$: BehaviorSubject<boolean> = new BehaviorSubject(false); 

 
  @Output() orderChange: EventEmitter <any> = new EventEmitter <any>();
  @Output() deleteChange: EventEmitter <any> = new EventEmitter <any>();

  ngOnInit(): void {
    this.data$.subscribe(
      () => { this.load$.next(true); }
    );  
  }

  order(){ this.orderChange.emit(arguments); };

}
