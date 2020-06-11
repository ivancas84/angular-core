import { Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { emptyUrl } from '@function/empty-url.function';
import { Display } from '@class/display';

export abstract class ShowElementComponent  {

  @Input() data$: Observable<any>; 
  /**
   * datos principales
   */

  @Input() display$?: Observable<Display>; 
 
  @Output() deleteChange: EventEmitter <any> = new EventEmitter <any>();

  constructor(
    protected router: Router,
  ) {}

  order(params: Array<string>): void {
    //Transformar valores de dislay a traves de los valores del formulario
    this.display$.subscribe(
      display => {
        display.setOrderByKeys(params);
        this.router.navigateByUrl('/' + emptyUrl(this.router.url) + '?' + display.encodeURI());  
      }
    );
  }
}
