import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { DataDefinitionService } from '@service/data-definition/data-definition.service';
import { Observable, of, ReplaySubject } from 'rxjs';
import { Display } from '@class/display';
import { debounceTime, distinctUntilChanged, tap, switchMap, map, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-filter-typeahead',
  templateUrl: './filter-typeahead.component.html',
})
export class FilterTypeaheadComponent implements OnInit {
  @Input() entity: string;
  @Input() filter: FormGroup;

  searching = false;
  searchFailed = false;
  load$;
  /**
   * Se necesita un Observable para inicializar valores, por ejemplo para el caso de que se comparta la url y no haya datos inicializados
   */

  constructor(public dd: DataDefinitionService) { }

  searchTerm(term: string): Observable<any> {
    if(term === "") return of([]);

    var display = new Display();
    display.condition = ["_search","=~",term];
    return this.dd.all(this.entity, display).pipe(
      tap(rows => console.log(rows)),

      map(rows => rows.map(row => row["id"]))
    );
  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.searching = true),
      switchMap(term =>
        this.searchTerm(term).pipe(
          tap(rows => console.log(rows)),

          tap(() => this.searchFailed = false),
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          })
        )
      ),
      tap(() => this.searching = false)
    )

    formatter = (id: string) => { return this.dd.labelGet(this.entity, id); }
    
    ngOnInit(): void {
      console.log(this.filter.get("value"));
      var id = this.filter.get("value").value;
      if(!id) this.load$ = of(true);
      else this.load$ = this.dd.get(this.entity,id);
      /**
       * Inicializar valor para almacenarlo en el storage
       */
    }

    get isSelected() {
      var id = this.filter.get("value").value;
      return (this.dd.storage.getItem(this.entity+id)) ? id : null;
    }
}
