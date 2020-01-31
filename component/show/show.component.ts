import { OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject, BehaviorSubject, Subject } from 'rxjs';
import { first } from 'rxjs/operators';
import { Display } from '../../class/display';
import { emptyUrl } from '@function/empty-url.function';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';
import { FormGroup, FormBuilder } from '@angular/forms';

export class ShowComponent implements OnInit {
  readonly entityName: string;

  data$: ReplaySubject<any> = new ReplaySubject();

  collectionSize$: BehaviorSubject<number> = new BehaviorSubject(0);
  /**
   * tamanio de la consulta
   * se hace coincidir el nombre con el paginador de ng-bootstrap
   */

  display: Display;
  /**
   * visualizacion
   */

  condition$: Subject<any> = new ReplaySubject();
  /**
   * condicion de busqueda (uso opcional mediante componente Search)
   */

  params$: Subject<any> =  new ReplaySubject();
  /**
   * parametros de busqueda (uso opcional mediante componente Search)
   */

  mode="reload";
  /**
   * reload: Recarga cantidad y datos
   * data: Recarga solo datos
   */

  constructor(
    protected dd: DataDefinitionService, 
    protected route: ActivatedRoute, 
    protected router: Router,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(
      params => {
        this.initDisplay(params);
        this.initData();
      }
    );      
  }

  
  getCount(){ return this.dd.count(this.entityName, this.display); }
  /**
   * cantidad
   */

  getData(){ return this.dd.all(this.entityName, this.display); }
  /**
   * datos
   */
   
  initDisplay(params){
    this.display = new Display();
    this.display.setConditionParams(params);
    this.condition$.next(this.display.condition);
    this.params$.next(this.display.params);
  }

  initData(){
    if(this.mode == "reload")
      this.getCount().pipe(first()).subscribe(
        count => { 
          if(this.collectionSize$.value != count) this.collectionSize$.next(count); 
        }
      );

    this.getData().pipe(first()).subscribe(
      rows => { this.data$.next(rows); 
      
      console.log(rows)}
    );

    this.mode = "reload";
  }

  orderChange(event) {
    this.mode = "data";
    this.display.setOrder(event);
    this.router.navigateByUrl('/' + emptyUrl(this.router.url) + '?' + this.display.encodeURI().join("&"));
  }

  pageChange(event) {
    this.mode = "data";
    this.display.page = event;
    this.router.navigateByUrl('/' + emptyUrl(this.router.url) + '?' + this.display.encodeURI().join("&"));
  }

  searchChange(event) {
    this.mode = "reload";
    this.display.condition = [];
    if(event.filters) this.display.setConditionFilters(event.filters);
    if(event.params) this.display.setParams(event.params);
    this.router.navigateByUrl('/' + emptyUrl(this.router.url) + '?' + this.display.encodeURI().join("&"));
  }

  deleteChange(event) {
    //@todo eliminar de la base de datos
    //this.mode = "data";
    //this.collectionSize$.next(this.collectionSize$.value-1); 
    //this.router.navigateByUrl('/' + emptyUrl(this.router.url) + '?' + this.display.encodeURI().join("&"));
  }

}
