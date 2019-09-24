import { OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReplaySubject, BehaviorSubject } from 'rxjs';
import { first } from 'rxjs/operators';
import { Display } from '../../class/display';
import { DataDefinitionService } from '../../service/data-definition/data-definition.service';

export class ShowComponent implements OnInit {
  entity: string;
  data$: ReplaySubject<any> = new ReplaySubject();
  collectionSize$: BehaviorSubject<number> = new BehaviorSubject(0);
  /**
   * Se hace coincidir el nombre con el paginador de ng-bootstrap
   */

  display: Display;
  sync: { [index: string]: boolean } = {};

  constructor(protected dd: DataDefinitionService, protected route: ActivatedRoute) {}

  getCount(){ return this.dd.count(this.entity, this.display); } //cantidad
  getData(){ return this.dd.all(this.entity, this.display); } //datos

   ngOnInit(): void {
    this.route.queryParams.subscribe(
      params => { 
        this.display = new Display();
        this.display.setParams(params);

        this.getCount().pipe(first()).subscribe(
          count => { 
            if(this.collectionSize$.value != count) this.collectionSize$.next(count); 
          }
        );

        this.getData().pipe(first()).subscribe(
          rows => { this.data$.next(rows); }
        );
      }
    );
  }
}