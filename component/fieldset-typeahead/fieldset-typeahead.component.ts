import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';
import { SessionStorageService } from '@service/storage/session-storage.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-fieldset-typeahead',
  templateUrl: './fieldset-typeahead.component.html',
})
export class FieldsetTypeaheadComponent implements OnInit  {
  
  @Input() entityName: string;
  @Input() fieldset: FormGroup;
  @Input() fieldName: string;
  @Input() readonly?: boolean = false;
  
  searching = false;
  searchFailed = false;
  load$: Observable<any>;
  /**
   * Se necesita un Observable para inicializar valores, por ejemplo para el caso de que se comparta la url y no haya datos inicializados
   */

  constructor(
    public dd: DataDefinitionService,
    protected storage: SessionStorageService
  ) {  }

  ngOnInit(): void {   
    var id = this.fieldset.get(this.fieldName).value;
    this.load$ = this.dd.getOrNull(this.entityName,id).pipe(
      map(
        response => {
          console.log(response);
          if(!response) return true;
          else return id;
        }
      )
    );
  }

  get linkAdd() {
    return this.entityName.replace("_", "-")+"-admin"
  }

  get isSelected() {
    var id = this.fieldset.get(this.fieldName).value;
    return (this.storage.getItem(this.entityName+id)) ? id : null;
  }

  searchTerm(term): Observable<any> {
    var display = new Display();
    display.search = term;
    return this.dd.all(this.entityName, display).map(
      rows => { return rows.map(row => { return row["id"]; }) }
    );
  }

  get field() { return this.fieldset.get(this.fieldName)}


  search = (text$: Observable<string>) =>
    text$
    .debounceTime(500)
    //.distinctUntilChanged()
    .do(() => this.searching = true)
    .switchMap(term =>
      term.length < 2 ?
        of([]) : this.searchTerm(term)
        .catch(error => {
          return of([]);
        }))
    .do(() => this.searching = false)

    formatter = (id: string) => this.dd.labelGet(this.entityName, id);



}
