import { Input, Output, EventEmitter } from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalConfirmComponent} from '../modal-confirm/modal-confirm.component';

import { DataDefinitionService } from '../../../service/data-definition/data-definition.service';
import { Display } from "../../class/display";
import { Router } from '@angular/router';

export abstract class TableComponent {
  entity: string; //entidad principal del componente
  //order: any = {}; //configuracion de ordenamiento. Deprecated? Se utiliza directamente display.order?

  @Input() display: Display = null; //filtros de visualizacion
  @Input() rows: any; //datos
  @Input() sync: any = []; //configuracion de sincronizacion

  @Output() changeData: EventEmitter <any> = new EventEmitter <any>();

  constructor(protected dd: DataDefinitionService, protected modalService: NgbModal, protected router: Router) { }

  isSync(field: string){ return this.dd.isSync(field, this.sync); }

  setOrder(){
    var keys = Object.keys(this.display.order);

    if((keys.length) && (arguments[0] == keys[0])){
      var type: string = (this.display.order[keys[0]].toLowerCase() == "asc") ? "desc" : "asc";
      this.display.order[keys[0]] = type;
    } else {
      var obj = {}
      for(var i = 0; i < arguments.length; i++) obj[arguments[i]] = "asc";
      this.display.order = Object.assign(obj, this.display.order);
    }

    this.changeData.emit();
  };

  delete(index:number) {
    const modalRef = this.modalService.open(ModalConfirmComponent);
    modalRef.componentInstance.label = this.dd.labelGet(this.entity, this.rows[index].id)

    modalRef.result.then(
      (result) => {
        if(result){
          this.dd.delete(this.entity, this.rows[index].id).subscribe(
            response => { if(response.status) this.rows.splice(index, 1); }
          )
        }
      },
      (reason) => { console.log(reason); }
    );
  }
}
