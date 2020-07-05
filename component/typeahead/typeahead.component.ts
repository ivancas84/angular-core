import { Component, OnInit, Input, SimpleChanges, OnChanges} from '@angular/core';
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
   */
  
  @Input() field: FormControl;
  @Input() entityName: string;
  @Input() readonly?: boolean = false;
  
  searchControl: FormControl = new FormControl();
  searchFailed: boolean = false;
  disabled: boolean = true;

  protected subscriptions = new Subscription();

  constructor(
    public dd: DataDefinitionService,
    protected storage: SessionStorageService
  ) {  }

  ngOnInit(): void {
    /** 
     * Se utiliza ngOnInit en vez de ngOnChanges porque permite reducir una linea de codigo
     * El ngOnChanges incluiria el mismo codigo bajo el if(changes['field'] && changes['field'].isFirstChange() ) {
     * Tener presente el Lifehook cycle
     */

    if(this.field.value) this.initValue(this.field.value);
    /** 
     * Se parte de un valor definido del field, asignado en el ngOnInit del padre 
     * El valueChanges accede a partir del segundo valor, por eso es necesario este if 
     **/

     var s = this.field.valueChanges.subscribe(
      value => {
        this.initValue(value)
      }
    );

    this.subscriptions.add(s);
  }
  
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

  searchTerm(term): Observable<any> {
    if(term === "") return of([]);

    var display = new Display();
    display.addCondition(["_label","=~",term]);
    return this.dd.all(this.entityName, display).pipe(
      map(rows => rows.map(row => row["id"] )),
    );
  }

  formatter = (id: string) => { return this.dd.label(this.entityName, id); }

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.field.markAsPending()),
      switchMap(term =>
        this.searchTerm(term).pipe(
          tap(() => this.searchFailed = false),
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          })
        )
      ),
      tap(() => this.field.markAsDirty())
    )

  selectItem(event){
    if (this.field.value != event.item) this.field.setValue(event.item);
  }

  get linkAdd() { return this.entityName.replace("_", "-")+"-admin" }

  ngOnDestroy () { this.subscriptions.unsubscribe() }

}
