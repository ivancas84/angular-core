import { OnInit } from '@angular/core';
import { Display } from 'core/class/display';
import { ActivatedRoute } from '@angular/router';
import { ReplaySubject } from 'rxjs';

import { DataDefinitionService } from '../../service/data-definition/data-definition.service';


export class ShowComponent implements OnInit {
  entity: string;
  data$: ReplaySubject<any> = new ReplaySubject();
  collectionSize$: ReplaySubject<number> = new ReplaySubject();

  display: Display = new Display();
  sync: { [index: string]: boolean } = {};


  /**
   * Se hace coincidir el nombre con el paginador de ng-bootstrap
   */
  mode="reload";
  /**
   * reload: Recarga cantidad y datos
   * data: Recarga solo datos (ej, cuando se pasa a una nueva página)
   */

  constructor(protected route: ActivatedRoute) {}

  getCount(){ return this.dd.count(this.entity, this.display); } //cantidad
  getData(){ return this.dd.all(this.entity, this.display); } //datos

  defineCountAndData(){
    this.getCount().subscribe(
      count => {
        this.collectionSize$.next(count);
        this.defineData();
      }
    );
  }

  defineData() {
    var s = this.getData().subscribe(
      rows => { this.rows = rows; }
    );
  }
  
  ngOnInit(): void {
    this.route.queryParams.subscribe(
      params => {
        if(this.mode == "reload") this.defineCountAndData(); else this.defineData();
        this.mode = "reload"; //reiniciar ej, se mueve entre pantallas
      }
    );
  }
}