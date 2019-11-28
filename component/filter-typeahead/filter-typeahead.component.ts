import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { DataDefinitionService } from '@service/data-definition/data-definition.service';
import { Observable, of, ReplaySubject } from 'rxjs';
import { Display } from '@class/display';
import { debounceTime, distinctUntilChanged, tap, switchMap, map, catchError } from 'rxjs/operators';
import { SessionStorageService } from '@service/storage/session-storage.service';

@Component({
  selector: 'app-filter-typeahead',
  templateUrl: './filter-typeahead.component.html',
})
export class FilterTypeaheadComponent implements OnInit {
  @Input() entity: string;
  @Input() filter: FormGroup;
  /**
   * Un filtro esta formado por name, option y value
   */

  searching = false;
  searchFailed = false;
  load$: Observable<any>;
  /**
   * Se necesita un Observable para inicializar valores, por ejemplo para el caso de que se comparta la url y no haya datos inicializados
   */

  constructor(
    public dd: DataDefinitionService,
    protected storage: SessionStorageService
  ) { }

  ngOnInit(): void {
    var id = this.filter.get("value").value;
    if(!id) this.load$ = of(true);
    else this.load$ = this.dd.labelGet(this.entity,id);
    /**
     * @todo investigar: En el fieldset-typeahead para que funcione correctamente, inicialize los datos en el fieldset padre
     */
  }

  searchTerm(term: string): Observable<any> {
    if(term === "") return of([]);

    var display = new Display();
    display.condition = ["_search","=~",term];
    return this.dd.all(this.entity, display).pipe(
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
          tap(() => this.searchFailed = false),
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          })
        )
      ),
      tap(() => this.searching = false)
    )

    formatter = (id: string) => { return this.dd.label(this.entity, id); }

    get isSelected() {
      var id = this.filter.get("value").value;
      return (this.storage.getItem(this.entity+id)) ? id : null;
    }
}
