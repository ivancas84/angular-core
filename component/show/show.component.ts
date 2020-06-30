import { OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject, BehaviorSubject, Subject, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { Display } from '../../class/display';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';

export class ShowComponent implements OnInit, OnDestroy {

  readonly entityName: string;
  /**
   * Nombre de la entidad principal
   */

  data$: ReplaySubject<any> = new ReplaySubject();
  /**
   * Datos principales
   */

  collectionSize$: ReplaySubject<number> = new ReplaySubject();
  /**
   * tamanio de la consulta
   * se hace coincidir el nombre con el paginador de ng-bootstrap
   */

  display$: BehaviorSubject<Display> = new BehaviorSubject(null);
  /**
   * Se define como BehaviorSubject para facilitar el acceso al valor actual evitando suscribirse continuamente
   */

  protected subscriptions = new Subscription();

  constructor(
    protected dd: DataDefinitionService, 
    protected route: ActivatedRoute, 
    protected router: Router,
  ) {}

  ngOnInit(): void {
    var s = this.route.queryParams.subscribe(
      queryParams => {
        this.initDisplay(queryParams);
        this.initCount();
        this.initData();
      }
    );     
    this.subscriptions.add(s); 
  }
   
  initDisplay(params: { [x: string]: any; }): void {
    let display = new Display();
    display = new Display();
    display.setSize(100);
    display.setParamsByQueryParams(params);
    this.display$.next(display);
  }
  
  initCount(){ 
    this.dd.count(this.entityName, this.display$.value).pipe(first()).subscribe(
      count => {  this.collectionSize$.next(count); }
    ) 
  }

  initData(){ 
    this.dd.all(this.entityName, this.display$.value).pipe(first()).subscribe(
      rows => { this.data$.next(rows); }
    ); 
  }

  ngOnDestroy () { this.subscriptions.unsubscribe() }

}
