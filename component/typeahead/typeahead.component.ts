import { Component, OnInit, Input} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';
import { SessionStorageService } from '@service/storage/session-storage.service';
import { map, debounceTime, distinctUntilChanged, tap, switchMap, catchError } from 'rxjs/operators';
import { Display } from '@class/display';

@Component({
  selector: 'app-typeahead',
  templateUrl: './typeahead.component.html',
})
export class TypeaheadComponent implements OnInit {
   
  @Input() field: FormControl;
  @Input() entityName: string;
  @Input() readonly?: boolean = false;
  
  searchControl = new FormControl();
  searching = false;
  searchFailed = false;

  constructor(
    public dd: DataDefinitionService,
    protected storage: SessionStorageService
  ) {  }

  ngOnInit(): void {
    /**
     * Proceso:
     * 1 Suscribirse a los datos principales
     * 2 Inicializar datos del field
     * 3 Reasignar valor del field para reflejar los cambios
     * 4 Tener en cuenta que para presentar el valor el field accede al storage
     */
    this.field.valueChanges.pipe(map(
      value => {
        if(value != this.searchControl.value) {
          this.dd.getOrNull(this.entityName, value).pipe(map(
            row => {this.searchControl.setValue(row)}
          ));
        }
      }
    ))
  }

  searchTerm(term): Observable<any> {
    if(term === "") return of([]);

    var display = new Display();
    display.addCondition(["_search","=~",term]);
    return this.dd.all(this.entityName, display).pipe(
      map(rows => rows.map(row => this.dd.label(this.entityName, row["id"]) )),
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

  selectItem(event){
    console.log(event);
  }

  get linkAdd() { return this.entityName.replace("_", "-")+"-admin" }
}
