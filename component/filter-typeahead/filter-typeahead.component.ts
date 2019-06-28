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
  selector: 'app-filter-typeahead',
  templateUrl: './filter-typeahead.component.html',
})
export class FilterTypeaheadComponent {
  @Input() entity: string;
  @Input() filter: FormGroup;

  searching = false;

  constructor(public dd: DataDefinitionService) {  }

  get isSelected() {
    var id = this.filter.get("value").value;
    return (this.dd.storage.getItem(this.entity+id)) ? id : null;
  }

  searchTerm(term): Observable<any> {
    var display = new Display();
    display.search = term;
    return this.dd.all(this.entity, display).map(
      rows => { return rows.map(row => { return row["id"]; }) }
    );
  }

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

    formatter = (id: string) => { return this.dd.labelGet(this.entity, id); }

}
