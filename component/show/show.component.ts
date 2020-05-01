import { OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject, BehaviorSubject, Subject } from 'rxjs';
import { first } from 'rxjs/operators';
import { Display } from '../../class/display';
import { emptyUrl } from '@function/empty-url.function';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';

export class ShowComponent implements OnInit {
  readonly entityName: string;

  //data$: BehaviorSubject<any> = new BehaviorSubject(null);
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

  condition$: ReplaySubject<any> = new ReplaySubject();
  /**
   * condicion de busqueda (uso opcional mediante componente Search)
   */

  params$: ReplaySubject<any> =  new ReplaySubject();
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
      queryParams => {
        this.initDisplay(queryParams);
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
    this.display.setSize(100);
    this.display.setConditionByQueryParams(params);
    this.condition$.next(this.display.getCondition());
    this.params$.next(this.display.getParams());
  }

  initData(){
    if(this.mode == "reload")
      this.getCount().pipe(first()).subscribe(
        count => { 
          if(this.collectionSize$.value != count) this.collectionSize$.next(count); 
        }
      );

    this.getData().pipe(first()).subscribe(
      rows => { this.data$.next(rows); }
    );

    this.mode = "reload";
  }

  orderChange(event) {
    this.mode = "data";
    this.display.setOrder(event);
    this.router.navigateByUrl('/' + emptyUrl(this.router.url) + '?' + this.display.encodeURI());
  }

  pageChange(event) {
    this.mode = "data";
    this.display.setPage(event);
    this.router.navigateByUrl('/' + emptyUrl(this.router.url) + '?' + this.display.encodeURI());
  }

  searchChange(event) {
    this.mode = "reload";
    this.display.setCondition([]);
    if(event.filters) this.display.setConditionFilters(event.filters);
    if(event.params) this.display.setParams(event.params);
    this.router.navigateByUrl('/' + emptyUrl(this.router.url) + '?' + this.display.encodeURI());
  }

  deleteChange(event) {
    //@todo eliminar de la base de datos
    //this.mode = "data";
    //this.collectionSize$.next(this.collectionSize$.value-1); 
    //this.router.navigateByUrl('/' + emptyUrl(this.router.url) + '?' + this.display.encodeURI());
  }

}
