import { OnInit, Input, OnChanges, SimpleChanges} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { Field } from '../../class/field';
import { Display } from '../../class/display';

import { DataDefinitionService } from '../../../service/data-definition/data-definition.service';

import { emptyUrl } from '../../function/empty-url.function';

export class ShowComponent implements OnInit {
  entity: string; //entidad principal
  display: Display; //parametros de consulta en un formato entendible por el servidor
  rows: any = []; //datos a visualizar
  sync: { [index: string]: boolean } = {}; //datos de sincronizacion
  //disabled: boolean; //deshabilitar inputs (si existen) deprecated?
  collectionSize: number = null; //cantidad de datos a visualizar
  /**
   * Se hace coincidir el nombre con el utilizado en el paginador de ng-bootstrap
   */

  mode="reload"; //modo de recarga de datos
  /**
   * reload: Recarga cantidad y datos
   * data: Recarga solo datos
   */

  constructor(protected dd: DataDefinitionService, protected route: ActivatedRoute, protected router: Router) {
    this.display = this.createDisplay();
  }


  createDisplay(){ return new Display(); } //crear display
  /**
   * se define en un metodo independiente para dar la posibilidad de sobrescritura en el caso de que se requiera inicializar parametros auxiliares al display
   */

  changeSearch() {
    /**
     * La modificacion de datos se asigna directamente en el subcomponente al atributo display
     */
    this.mode = "reload";
    this.changeUrl();
  }

  changeData() {
    /**
     * La modificacion de datos se asigna directamente en el subcomponente al atributo display
     */
    this.mode = "data";
    this.changeUrl();
  }


  getCount(){ return this.dd.count(this.entity, this.display); } //Obtener cantidad
  getData(){ return this.dd.all(this.entity, this.display); } //Obtener datos
  /**
   * Los métodos para obtener datos y cantidad se definen de forma independiente en un metodo para facilitar su sobrescritura en el caso que se requiera
   */

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

  changeUrl(){ //modificar url
    /**
     * Al modificar url se releen los parametros subscriptos y se reactiva toda la interfaz
     */
    let route = emptyUrl(this.router.url);
    let d = [];
    for(var key in this.display.describe()){ //Se accede al metodo display.describe() para ignorar los filtros no definidos
      if(this.display.hasOwnProperty(key)){
        if(this.display[key]){
          d.push(key + "=" + encodeURI(JSON.stringify(this.display[key])));
        }
      }
    }

    this.router.navigateByUrl('/' + route + '?' + d.join("&"));
  }

  defineDisplay(params:any): Display {
   /**
    * Se define un parametro prioritario "display" , que posee un json de los filtros definidos recientemente para facilitar el ruteo
    */
    var display = this.createDisplay();
    for(let i in params) {
      if(params.hasOwnProperty(i)) {
        if(!(i in display)) display.filters.push([i, "=", params[i]]); //asignar filtro
        else display[i] = JSON.parse(decodeURI(params[i])); //asignar parametro
      }
    }

    return display; //se reasigna para que tome los cambios el ngOnChanges de los nested components
  }

  initDisplay(display: Display){ //Inicializar display
    /**
     * Este metodo se define de forma independiente debido a que ciertos componentes pueden requerir la inicializacion de datos antes de setear el display
     */
    this.display = display;
    this.postDisplay();
   }

  postDisplay(){
    if(this.mode == "reload") this.defineCountAndData(); else this.defineData();
    this.mode = "reload"; //reiniciamos el modo en el caso de que se ejecute una redireccion por mover pantallas
  }

  queryParams(){
    this.route.queryParams.subscribe(
      params => {
        var display = this.defineDisplay(params);
        this.initDisplay(display);
      }
    );
  }
  
  ngOnInit() {
    this.dd.checkTransaction().pipe(first()).subscribe(
      response => {
        this.queryParams();
      }
    );
  }
}
