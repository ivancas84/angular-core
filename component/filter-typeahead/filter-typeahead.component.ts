import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { DataDefinitionService } from '@service/data-definition/data-definition.service';
import { Observable, of, ReplaySubject } from 'rxjs';
import { Display } from '@class/display';
import { debounceTime, distinctUntilChanged, tap, switchMap, map, catchError } from 'rxjs/operators';
import { SessionStorageService } from '@service/storage/session-storage.service';
import { isEmptyObject } from '@function/is-empty-object.function';

@Component({
  selector: 'app-filter-typeahead',
  templateUrl: './filter-typeahead.component.html',
})
export class FilterTypeaheadComponent {
  @Input() condition$: any; 
  /**
   * Datos principales, array de elementos de la forma [field, option, value]
   * El componente principal se suscribe a parametros y modifican los datos principales
   * Los datos principales son la base para realizar cualquier cambio en el formulario
   */

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

  ngOnInit(): void {
    /**
     * Proceso:
     * 1 Suscribirse a los datos principales
     * 2 Inicializar datos del field
     * 3 Reasignar valor del field para reflejar los cambios
     * 4 Tener en cuenta que para presentar el valor el field accede al storage
     */
    if(this.condition$)
      this.condition$.subscribe(
        condition => {
          for(let i = 0; i < condition.length; i++) {
            if((condition[i][0] == this.field.value) && !isEmptyObject(condition[i][2])) {
              this.dd.getOrNull(this.entityName, condition[i][2]).subscribe(
                r => this.value.setValue(condition[i][2])
              );
            }
          }
        }
      )
  }

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

    get field() { return this.filter.get("field") }
    get option() { return this.filter.get("option")}
    get value() { return this.filter.get("value")}

}
