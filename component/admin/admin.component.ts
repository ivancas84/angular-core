import { FormGroup, FormBuilder } from '@angular/forms';
import { ReplaySubject, Subscription, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';
import { first } from 'rxjs/operators';
import { Location } from '@angular/common';
import { emptyUrl } from '@function/empty-url.function';
import { SessionStorageService } from '@service/storage/session-storage.service';
import { isEmptyObject } from '@function/is-empty-object.function';
import { ToastService } from '@service/ng-bootstrap/toast.service';
import { OnInit, AfterViewInit } from '@angular/core';
import { markAllAsTouched } from '@function/mark-all-as-touched';
import { logValidationErrors } from '@function/log-validation-errors';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalAlertComponent } from '@component/modal-alert/modal-alert.component';

export abstract class AdminComponent implements OnInit, AfterViewInit {
/**
 * Formulario de administracion (FormGroup) formado por fieldsets (FormGroups)
 */

  adminForm: FormGroup = this.fb.group({});
  /**
   * Formulario principal
   * Se asignaran dinamicamente los formgroups correspondientes a fieldsets
   */

  readonly entityName: string;
  /**
   * Entidad principal
   */
  
  data$:ReplaySubject<any> = new ReplaySubject();
  /**
   * Datos principales
   * Se define como ReplaySubject porque puede recibir valores nuevos que deben ser asignados con metodo .next
   * No se utiliza BehaviorSubject para evitar procesamiento adicional con el valor null
   * null es un dato valido para data$ significa que no esta definido por lo que los subcomponentes inicializaran como si estuviera vacio
   * Se podria usar BehaviorSubject y manejar diferentes alternativas para indicar si esta o no definido, por ejemplo null o false
   */

  isDeletable: boolean = false;
  /**
   * Flag para habilitar/deshabilitar boton eliminar
   */

  isSubmitted: boolean = false;
  /**
   * Flag para habilitar/deshabilitar boton aceptar
   */

  protected subscriptions = new Subscription();
   
  constructor(
    protected fb: FormBuilder, 
    protected route: ActivatedRoute, 
    protected router: Router, 
    protected location: Location, 
    protected dd: DataDefinitionService, 
    protected toast: ToastService, 
    protected storage: SessionStorageService, 
    protected modalService: NgbModal
  ) {}
  
  ngAfterViewInit(): void {
    this.removeStorage();
    /**
     * Si no se incluye, nunca se limpia el formulario 
     * Puede resultar confuso cuando se asignan otros parametros a la url
     */
  }
  

  ngOnInit() {
    this.storageValueChanges();
    this.initData();   
  }

  storageValueChanges() {
    var s = this.adminForm.valueChanges.subscribe (
      formValues => { this.storage.setItem(this.router.url, formValues); },
      error => { this.toast.showDanger(JSON.stringify(error)); }
    );
    this.subscriptions.add(s);
  }

  initData(){
    /**
     * No realizar la suscripcion en el template (cambia el Lifecycle)! 
     * Puede generar errores "ExpressionChanged"
     */
    var s = this.route.queryParams.subscribe(
      params => { this.setData(params); },
      error => { this.toast.showDanger(JSON.stringify(error)); }
    )
    this.subscriptions.add(s);
    
  }

  setData(params: any): void {
    if(isEmptyObject(params)) {
      this.data$.next(null);
      return;
    } 

    this.dd.uniqueOrNull(this.entityName, params).pipe(first()).subscribe(
      response => {
        if (response) this.data$.next(response);
        else this.data$.next(params);
      },
      error => { 
        const modalRef = this.modalService.open(ModalAlertComponent); 
        modalRef.componentInstance.title = 'Error';
        modalRef.componentInstance.message = error.error;
      }
    ); 
  }

  removeStorage(){ 
    /**
     * Eliminar datos del storage
     * Se elimina la ruta actual y las variantes de la ruta actual
     * Las variantes corresponden a aquellas url que tienen la misma ruta pero diferentes parametros
     */
    var route = this.router.url;
    var index = this.router.url.indexOf('?');
    if (index != -1) route = this.router.url.substring(0, index);
    this.storage.removeItemsPrefix(route);
  }

  back() { this.location.back(); }

  delete() { this.toast.showInfo ("No implementado"); }

  clear(): void {
    /**
     * Limpiar url y reinicializa datos
     * si la ruta es diferente, se reasignaran los parametros de la url y se repetira el proceso de inicializacion
     * si la ruta es la misma, se limpia el storage y se asignan parametros en null
     */
    let route = emptyUrl(this.router.url);
    if(route != this.router.url) this.router.navigateByUrl('/' + route);
    else this.setData(this.route.snapshot.queryParams)
    
  }

  reset(): void{
    this.setData(this.route.snapshot.queryParams)
  }
  
  persist(): Observable<any> {
    /**
     * Persistencia
     * Se define un metodo independiente para facilitar la redefinicion
     * @return "datos de respuesta (habitualmente array de logs)"
     */
    return this.dd.persist(this.entityName, this.serverData())
  }

  onSubmit(): void {
    /**
     * Enviar formulario
     */
    this.isSubmitted = true;
    
    if (!this.adminForm.valid) {
      markAllAsTouched(this.adminForm);
      logValidationErrors(this.adminForm);
      const modalRef = this.modalService.open(ModalAlertComponent); 
      modalRef.componentInstance.title = 'Error';
      modalRef.componentInstance.message = "El formulario posee errores.";
      this.toast.showInfo("Verificar formulario");
      this.isSubmitted = false;

    } else {
      var s = this.persist().pipe(first()).subscribe(
        response => {
          this.storage.removeItemsPersisted(response);
          this.reload(response);
        },
        error => { 
          console.log(error);
          const modalRef = this.modalService.open(ModalAlertComponent); 
          modalRef.componentInstance.title = 'Error';
          modalRef.componentInstance.message = error.error;
        }
      );
      this.subscriptions.add(s);
    }
  }

  reload(response){
    /**
     * Recargar una vez persistido
     */
    let route = emptyUrl(this.router.url) + "?id="+this.getProcessedId(response);
    if(route != this.router.url) this.router.navigateByUrl('/' + route);
    else this.setData(this.route.snapshot.queryParams)
    this.toast.showSuccess("Registro realizado");
    this.isSubmitted = false;
  }

  getProcessedId(logs: Array<any>) {  
    /**
     * Obtener el id de procesamientoo principal
     */
    for(var i in logs){
      if(logs[i].indexOf(this.entityName) === 0) {
        var re = new RegExp(this.entityName,"g");
        return logs[i].replace(re, "");
      }
    }
  }

  serverData() {  
    return this.adminForm.get(this.entityName).value;
    //return this.adminForm.value
  }

  ngOnDestroy () { this.subscriptions.unsubscribe() }
}