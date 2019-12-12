import { ReplaySubject, Subscription } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from '@angular/common';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';
import { ToastService } from '@service/ng-bootstrap/toast.service';
import { isEmptyObject } from '@function/is-empty-object.function';
import { first } from 'rxjs/operators';

export abstract class DetailComponent {
/**
 * Detalle de entidad
 */

  readonly entityName: string;
  /**
   * entidad principal
   */
  
  data$ = new ReplaySubject();
  /**
   * datos principales
   */

  protected subscriptions = new Subscription();
  /**
   * las subscripciones son almacenadas para desuscribirse (solucion temporal al bug de Angular)
   * @todo En versiones posteriores de angular, eliminar el atributo subscriptions y su uso
   */
   

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected location: Location,
    protected dd: DataDefinitionService,
    protected toast: ToastService,
  ) {}
  
  ngOnInit() {
    var s = this.route.queryParams.subscribe (
      params => { this.setDataFromParams(params); },
      error => { this.toast.showDanger(JSON.stringify(error)); }
    );
    this.subscriptions.add(s);
  }

  setDataFromParams(params: any): void {
    if(isEmptyObject(params)) {
      this.data$.next(null);
      return;
    } 

    this.dd.uniqueOrNull(this.entityName, params).pipe(first()).subscribe(
      response => {
        if (response) this.data$.next(response);
        else this.data$.next(params);
      }
    );
  }

  back() { this.location.back(); }

  delete() { this.toast.showInfo ("No implementado"); }

  ngOnDestroy () { this.subscriptions.unsubscribe() } //eliminar subscripciones
}