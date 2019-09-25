import { Input, Output, EventEmitter } from '@angular/core';
import { DataDefinitionService } from "../../service/data-definition/data-definition.service";


export abstract class TableComponent {
  entity: string; //entidad principal del componente

  @Input() data$: any; //datos
  @Input() sync: any = []; //sincronizacion

  @Output() orderChange: EventEmitter <any> = new EventEmitter <any>();
  @Output() deleteChange: EventEmitter <any> = new EventEmitter <any>();

  constructor(protected dd: DataDefinitionService) { }

  isSync(field: string){ return this.dd.isSync(field, this.sync); }

  order(){ this.orderChange.emit(arguments); };

}
