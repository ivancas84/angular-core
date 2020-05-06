import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';
import { SessionStorageService } from '@service/storage/session-storage.service';
import { map, debounceTime, distinctUntilChanged, tap, switchMap, catchError } from 'rxjs/operators';
import { Display } from '@class/display';

@Component({
  selector: 'app-fieldset-typeahead',
  templateUrl: './fieldset-typeahead.component.html',
})
export class FieldsetTypeaheadComponent implements OnInit {
   
  @Input() data$: any; 
  /**
   * Datos principales, instancia de "entityName"
   * El componente principal se suscribe a parametros y modifican los datos principales
   * Los datos principales son la base para realizar cualquier cambio en el formulario
   */
  
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

  ngOnInit(): void {
    /**
     * Proceso:
     * 1 Suscribirse a los datos principales
     * 2 Inicializar datos del field
     * 3 Reasignar valor del field para reflejar los cambios
     * 4 Tener en cuenta que para presentar el valor el field accede al storage
     */
    this.data$.subscribe(
      response => {
        if(response[this.fieldName]){
          this.dd.getOrNull(this.entityName, response[this.fieldName]).subscribe(
            r => this.field.setValue(response[this.fieldName])
          );
        }
      }
    )
    
  }

  searchTerm(term): Observable<any> {
    if(term === "") return of([]);

    var display = new Display();
    display.addCondition(["_search","=~",term]);
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
