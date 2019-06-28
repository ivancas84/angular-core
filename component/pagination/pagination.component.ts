import { Component, Input, OnChanges, OnInit, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Display } from '../../class/display';
import { DataDefinitionService } from '../../../service/data-definition/data-definition.service';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
})
export class PaginationComponent implements OnChanges {

  @Input() display: Display;
  @Input() collectionSize: number;
  @Output() changeData: EventEmitter <any> = new EventEmitter <any>();

  page: number = 1;
  constructor(protected dd: DataDefinitionService, protected router: Router) {}

  reload(){ 
    if(this.page != this.display.page) {  //se incluye el if para evitar la multiple recarga
      this.display.page = this.page;
      this.changeData.emit();
    } 
  }

  ngOnChanges(changes: SimpleChanges) {
  /**
   * si collectionSize se asigna dinamicamente, se reinicia page, 
   * por lo tanto page debe asignarse tambien dinamicamente y asegurandose de que sea despues de que collectionSize se modifica
   */
    if(changes.collectionSize && changes.collectionSize.currentValue) {
    /**
     * El chequeo changes.collectionSize.currentValue pareceria que no hace falta
     * pero asigna pagina = 1 si no se incluye
     */
      if(this.page != this.display.page) this.page = this.display.page; //se incluye el if para evitar la multiple recarga
    } 

  }

}