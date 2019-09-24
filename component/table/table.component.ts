import { Input, Output, EventEmitter } from '@angular/core';
import { Display } from "../../class/display";
import { DataDefinitionService } from "../../service/data-definition/data-definition.service";


export abstract class TableComponent {
  entity: string; //entidad principal del componente
  //order: any = {}; //configuracion de ordenamiento. Deprecated? Se utiliza directamente display.order?

  @Input() display: Display; //filtros de visualizacion
  @Input() rows: any; //datos
  @Input() sync: any = []; //configuracion de sincronizacion

  @Output() changeData: EventEmitter <any> = new EventEmitter <any>();

  constructor(protected dd: DataDefinitionService) { }

  setOrder(){
    this.display.setOrder(arguments);
    this.changeData.emit();
  };

}
