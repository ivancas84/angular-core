import { Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { emptyUrl } from '@function/empty-url.function';
import { Display } from '@class/display';
import { first } from 'rxjs/operators';

export abstract class ShowElementComponent  {

  @Input() data$: Observable<any>; 
  /**
   * datos principales
   */

  @Input() display$?: Observable<Display>; 
  /**
   * No conviene utilizar ReplaySubject (como el padre?)
   */
 
  @Output() deleteChange: EventEmitter <any> = new EventEmitter <any>();

  constructor(
    protected router: Router,
  ) {}

  order(params: Array<string>): void {
    /**
     * Transformar valores de ordenamiento del atributo display
     */
    this.display$.pipe(first()).subscribe(
      display => {
        display.setOrderByKeys(params);
        this.router.navigateByUrl('/' + emptyUrl(this.router.url) + '?' + display.encodeURI());  
      }
    );
  }

}

