import { Component, OnInit, Input} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, of, Subscription } from 'rxjs';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';
import { SessionStorageService } from '@service/storage/session-storage.service';
import { map, debounceTime, distinctUntilChanged, tap, switchMap, catchError, mergeMap, first } from 'rxjs/operators';
import { Display } from '@class/display';

@Component({
  selector: 'app-typeahead',
  templateUrl: './typeahead.component.html',
})
export class TypeaheadComponent implements OnInit {
  /**
   * Utiliza un FormControl independiente para asignar el valor del FormControl enviado como parametro evitando el multiple cambio
   * Deshabilita el FormControl una vez seleccionado el valor
   * Permite iniciar y deshabilitar el FormControl para reasignar el valor 
   * El comportamiento descripto en 2 y 3 facilita la implementacion y evita que el usuario no deje un valor sin asignar
   */
  
  @Input() field: FormControl;
  @Input() entityName: string;
  @Input() readonly?: boolean = false;
  
  searchControl: FormControl = new FormControl();
  searching: boolean = false;
  searchFailed: boolean = false;
  disabled: boolean = true;

  protected subscriptions = new Subscription();
  /**
   * las subscripciones son almacenadas para desuscribirse (solucion temporal al bug de Angular)
   * @todo En versiones posteriores de angular, eliminar el atributo subscriptions y su uso
   */

  constructor(
    public dd: DataDefinitionService,
    protected storage: SessionStorageService
  ) {  }

  initValue(value){
    this.dd.getOrNull(this.entityName, value).pipe(first()).subscribe(
      row => {
        if(row) { 
          this.searchControl.setValue(row["id"]);
          this.searchControl.disable();
        } else {
          this.searchControl.setValue(null);
          if(!this.readonly) this.searchControl.enable();
        }
      }
    );
  }

  ngOnInit(): void {
    if(this.field.value) this.initValue(this.field.value);

    var s = this.field.valueChanges.subscribe(
      value => this.initValue(value)
    );

    this.subscriptions.add(s);
  }

  searchTerm(term): Observable<any> {
    if(term === "") return of([]);

    var display = new Display();
    display.addCondition(["_search","=~",term]);
    return this.dd.all(this.entityName, display).pipe(
      map(rows => rows.map(row => row["id"] )),
    );
  }

  formatter = (id: string) => { return this.dd.label(this.entityName, id); }

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
    if (this.field.value != event.item) this.field.setValue(event.item);
  }

  get linkAdd() { return this.entityName.replace("_", "-")+"-admin" }

  ngOnDestroy () { this.subscriptions.unsubscribe() }

}
