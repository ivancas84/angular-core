import { Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { Display } from '@class/display';
import { emptyUrl } from '@function/empty-url.function';
import { first } from 'rxjs/operators';
import { markAllAsTouched } from '@function/mark-all-as-touched';
import { logValidationErrors } from '@function/log-validation-errors';
import { ModalAlertComponent } from '@component/modal-alert/modal-alert.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '@service/ng-bootstrap/toast.service';

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

  isSubmitted: boolean = false;
  /**
   * Flag para habilitar/deshabilitar boton aceptar
   */

  constructor(
    protected fb: FormBuilder,
    protected router: Router,
    protected toast: ToastService, 
    protected modalService: NgbModal
  ) {}

  onSubmit(): void {
    /**
     * Transformar valores del atributo display$ a traves de los valores del formulario
     */

    this.isSubmitted = true;

    if (!this.searchForm.valid) {
      markAllAsTouched(this.searchForm);
      logValidationErrors(this.searchForm);
      const modalRef = this.modalService.open(ModalAlertComponent); 
      modalRef.componentInstance.title = 'Error';
      modalRef.componentInstance.message = "El formulario posee errores.";
      this.toast.showInfo("Verificar formulario");
      this.isSubmitted = false;
    } else {
      this.display$.pipe(first()).subscribe(
        display => {
          if(this.searchForm.get("condition")) display.setConditionByFilters(this.searchForm.get("condition").value);    
          if(this.searchForm.get("params")) display.setParams(this.searchForm.get("params").value);    
          if(this.searchForm.get("order")) { display.setOrderByElement(this.searchForm.get("order").value); }    

          this.router.navigateByUrl('/' + emptyUrl(this.router.url) + '?' + display.encodeURI());  
        }
      );
    }
  }
}
