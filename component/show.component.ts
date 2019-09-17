import { OnInit } from '@angular/core';
import { Display } from 'core/class/display';
import { ActivatedRoute } from '@angular/router';

export class ShowComponent implements OnInit {
  entity: string;
  rows: any = [];
  display: Display = new Display();
  sync: { [index: string]: boolean } = {};
  collectionSize: number = null;
  /**
   * Se hace coincidir el nombre con el paginador de ng-bootstrap
   */
  mode="reload";
  /**
   * reload: Recarga cantidad y datos
   * data: Recarga solo datos (ej, cuando se pasa a una nueva página)
   */


  constructor(protected route: ActivatedRoute) {}

  defineCountAndData(){
    this.getCount().subscribe(
      count => {
        this.collectionSize = count;
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
    this.mode = "reload"; //reiniciamos el modo en el caso de que se ejecute una redireccion por mover pantallas
      }
    );
  }
}