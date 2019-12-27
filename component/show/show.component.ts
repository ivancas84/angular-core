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
   * Tamanio de la consulta
   * Se hace coincidir el nombre con el paginador de ng-bootstrap
   */

  display: Display;
  /**
   * Visualizacion
   */

  condition$: Subject<any> = new ReplaySubject();
  /**
   * Condicion de busqueda
   */

  params$: Subject<any> =  new ReplaySubject();
  /**
   * Parametros auxiliares de busqueda
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

  getCount(){ return this.dd.count(this.entityName, this.display); } //cantidad
  getData(){ return this.dd.all(this.entityName, this.display); } //datos

  initDisplay(params){
    this.display = new Display();
    this.display.setConditionParams(params);
    //console.log(this.display);
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
      rows => { this.data$.next(rows); }
    );

    this.mode = "reload";
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(
      params => {
        this.initDisplay(params);
        this.initData();
      }
    );      
  }

  
  orderChange(event){
    this.mode = "data";
    this.display.setOrder(event);
    this.router.navigateByUrl('/' + emptyUrl(this.router.url) + '?' + this.display.encodeURI().join("&"));
  }

  pageChange(event){
    this.mode = "data";
    this.display.page = event;
    this.router.navigateByUrl('/' + emptyUrl(this.router.url) + '?' + this.display.encodeURI().join("&"));
  }


  searchChange(event){
    this.mode = "reload";
    this.display.condition = [];
    if(event.filters) this.display.setConditionFilters(event.filters);
    if(event.params) this.display.setParams(event.params);
    this.router.navigateByUrl('/' + emptyUrl(this.router.url) + '?' + this.display.encodeURI().join("&"));
  }

  deleteChange(event){
    this.mode = "data";
    this.collectionSize$.next(this.collectionSize$.value-1); 
    //@todo eliminar de la base de datos
    this.router.navigateByUrl('/' + emptyUrl(this.router.url) + '?' + this.display.encodeURI().join("&"));
  }

}
