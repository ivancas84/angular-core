import { Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
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

  protected subscriptions = new Subscription();

  constructor(
    protected router: Router,
  ) {}

  order(params: Array<string>): void {
    /**
     * Transformar valores de ordenamiento del atributo display
     * @todo En el parametro padre display$ es un BehaviorSubject, 
     * conviene que en este componente tambien sea un BehaviorSubject asi te suscribis directamente
     * mi unica duda es si se debe clonar el valor de display$.value o se puede utilizar directamente
     */
    var s= this.display$.subscribe(
      display => {
        display.setOrderByKeys(params);
        this.router.navigateByUrl('/' + emptyUrl(this.router.url) + '?' + display.encodeURI());  
      }
    );
    this.subscriptions.add(s);
  }

  ngOnDestroy () { this.subscriptions.unsubscribe() }
}

