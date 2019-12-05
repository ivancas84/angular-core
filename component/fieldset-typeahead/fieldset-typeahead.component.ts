import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';
import { SessionStorageService } from '@service/storage/session-storage.service';
import { map, debounceTime, distinctUntilChanged, tap, switchMap, catchError } from 'rxjs/operators';
import { Display } from '@class/display';

@Component({
  selector: 'app-fieldset-typeahead',
  templateUrl: './fieldset-typeahead.component.html',
})
export class FieldsetTypeaheadComponent {
  
  @Input() entityName: string;
  @Input() fieldset: FormGroup;
  @Input() fieldName: string;
  @Input() readonly?: boolean = false;
  
  searching = false;
  searchFailed = false;

  constructor(
    public dd: DataDefinitionService,
    protected storage: SessionStorageService
  ) {  }

  searchTerm(term): Observable<any> {
    if(term === "") return of([]);

    var display = new Display();
    display.condition = ["_search","=~",term];
    return this.dd.all(this.entityName, display).pipe(
      map(rows => rows.map(row => row["id"] )),
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
    var id = this.fieldset.get(this.fieldName).value;
    return (this.storage.getItem(this.entityName+id)) ? id : null;
  }

  get field() { return this.fieldset.get(this.fieldName)}

  get linkAdd() { return this.entityName.replace("_", "-")+"-admin" }
}
