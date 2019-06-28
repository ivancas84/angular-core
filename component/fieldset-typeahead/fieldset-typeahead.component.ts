import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import {Observable} from 'rxjs/Observable';
import {of} from 'rxjs/observable/of';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';

import { Display } from "../../class/display";
import { DataDefinitionService } from '../../../service/data-definition/data-definition.service';

@Component({
  selector: 'app-fieldset-typeahead',
  templateUrl: './fieldset-typeahead.component.html',
})
export class FieldsetTypeaheadComponent implements OnInit  {
  
  @Input() entityName: string;
  @Input() fieldset: FormGroup;
  @Input() fieldName: string;
  @Input() readonly?: boolean = false;
  load$: any;


  searching = false;

  constructor(public dd: DataDefinitionService) {  }

  ngOnInit(): void {
    /*console.log("test")
    var id = this.fieldset.get(this.fieldName).value;
    this.load$ = this.dd.getOrNull(this.entityName,id).map(
      response => {
        console.log(response);
        if(!response) return true;
        else return id;
      }
    )*/
  }

  get linkAdd() {
    return this.entityName.replace("_", "-")+"-admin"
  }

  get isSelected() {
    var id = this.fieldset.get(this.fieldName).value;
    return (this.dd.storage.getItem(this.entityName+id)) ? id : null;
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
