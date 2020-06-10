import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { Display } from '@class/display';
import { Router } from '@angular/router';
import { emptyUrl } from '@function/empty-url.function';


@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
})
export class PaginationComponent  {

  @Input() display$: BehaviorSubject<Display>;
  @Input() collectionSize$: ReplaySubject<number>;

  constructor( protected router: Router ) { }

  setPage() {
    this.router.navigateByUrl('/' + emptyUrl(this.router.url) + '?' + this.display$.value.encodeURI());    
  }

}