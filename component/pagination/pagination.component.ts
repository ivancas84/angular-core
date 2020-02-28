import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
})
export class PaginationComponent  {

  @Input() page: number;
  @Input() size: number;
  @Input() collectionSize$: BehaviorSubject<number>;
  @Output() pageChange: EventEmitter <any> = new EventEmitter <any>();

  setPage(){ this.pageChange.emit(this.page); };

}