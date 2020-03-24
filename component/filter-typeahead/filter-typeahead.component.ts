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
export class FilterTypeaheadComponent {
  @Input() entityName: string;
  @Input() filter: FormGroup;
  /**
   * Un filtro esta formado por name, option y value
   */

  searching = false;
  searchFailed = false;

  constructor(
    public dd: DataDefinitionService,
    protected storage: SessionStorageService
  ) { }

  searchTerm(term: string): Observable<any> {
    if(term === "") return of([]);

    var display = new Display();
    display.setCondition(["_search","=~",term]);
    return this.dd.all(this.entityName, display).pipe(
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

    formatter = (id: string) => { return this.dd.label(this.entityName, id); }

    get isSelected() {
      var id = this.filter.get("value").value;
      return (this.storage.getItem(this.entityName+id)) ? id : null;
    }
}
