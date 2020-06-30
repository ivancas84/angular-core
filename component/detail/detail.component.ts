import { ReplaySubject, Subscription } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from '@angular/common';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';
import { ToastService } from '@service/ng-bootstrap/toast.service';
import { isEmptyObject } from '@function/is-empty-object.function';
import { first } from 'rxjs/operators';
import { OnInit, OnDestroy } from '@angular/core';

export abstract class DetailComponent implements OnInit, OnDestroy {

  readonly entityName: string;
  /**
   * Nombre de la entidad principal
   */

  data$: ReplaySubject<any> = new ReplaySubject();
  /**
   * Datos principales
   */

  protected subscriptions = new Subscription();

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected location: Location,
    protected dd: DataDefinitionService,
    protected toast: ToastService,
  ) {}
  
  ngOnInit() {
    var s = this.route.queryParams.subscribe (
      params => { this.initData(params); },
      error => { this.toast.showDanger(JSON.stringify(error)); }
    );
    this.subscriptions.add(s);
  }

  initData(params: any): void {
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

  ngOnDestroy () { this.subscriptions.unsubscribe() }
}