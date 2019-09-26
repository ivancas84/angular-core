import { Component, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
})
export class PaginationComponent  {

  @Input() page: number;
  @Input() size: number;
  @Input() collectionSize$: number;
  @Output() pageChange: EventEmitter <any> = new EventEmitter <any>();

  setPage(){ this.pageChange.emit(this.page); };

}