import { Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { Display } from '@class/display';
import { emptyUrl } from '@function/empty-url.function';
import { first } from 'rxjs/operators';

export abstract class SearchComponent {

  @Input() display$: Observable<Display>;
  /**
   * Busqueda a traves de condicion
   * implementacion opcional mediante componente SearchCondition
   * No conviene utilizar ReplaySubject (como el padre?)
   */ 

  searchForm: FormGroup = this.fb.group({});
  /**
   * Formulario de busqueda
   */

  public optCard: boolean = false;
  /**
   * Activar o desactivar el card de opciones
   */

  
  constructor(
    protected fb: FormBuilder,
    protected router: Router,
  ) {}

  onSubmit(): void {
    /**
     * Transformar valores del atributo display$ a traves de los valores del formulario
     */
    this.display$.pipe(first()).subscribe(
      display => {
        if(this.searchForm.get("filters")) display.setConditionByFilters(this.searchForm.get("filters").value);    
        if(this.searchForm.get("params")) display.setParams(this.searchForm.get("params").value);    
        if(this.searchForm.get("order")) {
          console.log(this.searchForm.get("order").value)
          display.setOrderByElement(this.searchForm.get("order").value);
          console.log(display);
        }    

        this.router.navigateByUrl('/' + emptyUrl(this.router.url) + '?' + display.encodeURI());  
      }
    );
  }
}
