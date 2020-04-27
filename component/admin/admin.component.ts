import { FormGroup, FormBuilder, AbstractControl, FormControl, FormArray, ValidationErrors } from '@angular/forms';
import { ReplaySubject, Subscription, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';
import { ValidatorsService } from '@service/validators/validators.service';
import { first } from 'rxjs/operators';
import { Location } from '@angular/common';
import { emptyUrl } from '@function/empty-url.function';
import { SessionStorageService } from '@service/storage/session-storage.service';
import { isEmptyObject } from '@function/is-empty-object.function';
import { ToastService } from '@service/ng-bootstrap/toast.service';
import { OnInit } from '@angular/core';
import { markAllAsTouched } from '@function/mark-all-as-touched';
import { logValidationErrors } from '@function/log-validation-errors';

export abstract class AdminComponent implements OnInit {
/**
 * Formulario de administracion FormGroup (adminForm) cuyos elementos son tambien FormGroups correspondientes a los fieldsets
 * Se recomienda no modificar el id de la tabla principal en las actualizaciones
 */

  adminForm: FormGroup = this.fb.group({});
  /**
   * formulario
   * se asignaran dinamicamente los formgroups correspondientes a fieldsets
   */

  readonly entityName: string;
  /**
   * entidad principal
   */
  
  data$ = new ReplaySubject();
  /**
   * datos principales
   * El tipo se define porque el valor inicial puede ser asignado en null luego de determinar que no hay parametros ni valores en el storage
   */

  params$ = new ReplaySubject();
  /**
   * parametros
   * El tipo se define porque el valor inicial puede ser asignado en null luego de determinar que no hay parametros
   */

  isDeletable: boolean = false;
  /**
   * flag para habilitar/deshabilitar boton eliminar
   */

  isSubmitted: boolean = false;
  /**
   * flag para habilitar/deshabilitar boton aceptar
   */

  params: any;
  /**
   * Parametros actuales
   */

  protected subscriptions = new Subscription();
  /**
   * las subscripciones son almacenadas para desuscribirse (solucion temporal al bug de Angular)
   * @todo En versiones posteriores de angular, eliminar el atributo subscriptions y su uso
   */
   
  constructor(
    protected fb: FormBuilder, 
    protected route: ActivatedRoute, 
    protected router: Router, 
    protected location: Location, 
    protected dd: DataDefinitionService, 
    protected toast: ToastService, 
    protected validators: ValidatorsService,
    protected storage: SessionStorageService, 
  ) {}

  ngOnInit() {
    this.storageValueChanges();
    this.subscribeQueryParams();   
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
    var s = this.params$.subscribe (
      params => {
        this.params = params;
        let formValues = this.storage.getItem(this.router.url);
        this.removeStorage();
        if(formValues) this.setDataFromStorage(formValues);
        else this.setDataFromParams(params);
      },
      error => { this.toast.showDanger(JSON.stringify(error)); }
    )
    this.subscriptions.add(s);
  }

  subscribeQueryParams() {
    var s = this.route.queryParams.subscribe (
      params => { this.params$.next(params); },
      error => { this.toast.showDanger(JSON.stringify(error)); }
    );
    this.subscriptions.add(s);
  }

  setDataFromStorage(formValues: any): void {
    var d = formValues.hasOwnProperty(this.entityName)? formValues[this.entityName] : null;
    this.data$.next(d);   
  }

  setDataFromParams(params: any): void {
    if(isEmptyObject(params)) {
      this.data$.next(null);
      return;
    } 

    this.dd.uniqueOrNull(this.entityName, params).pipe(first()).subscribe(
      response => {
        if (response) this.data$.next(response);
        else this.data$.next(params);
      }
    ); 
  }

  removeStorage(){ //eliminar datos del storage 
    /**
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

  clear(): void { //limpia la url y declara los datos vacios
    /**
     * si la ruta es diferente, se reasignaran los parametros de la url y se repetira el proceso de inicializacion
     * si la ruta es la misma, se limpia el storage y se asignan parametros en null
     */
    let route = emptyUrl(this.router.url);
    if(this.router.url != route) this.router.navigateByUrl('/' + route);
    
    else {
      this.removeStorage();
      this.params$.next(null);
    }
  }

  reset(): void{
    this.removeStorage();
    this.params$.next(this.params);

    /*var s = this.params$.subscribe(
      params => { this.setDataFromParams(params); },
      error => { this.toast.showDanger(JSON.stringify(error)); }
    )
    this.subscriptions.add(s);*/
  }
  
  persist(): Observable<any> {
    /**
     * persistencia
     * Se define un metodo independiente para facilitar la redefinicion
     * @return {
     *  "data":"datos de respuesta (habitualmente array de logs)"
     *  "message": "mensaje de respuesta"
     *  "status": "OK"|"WARNING"
     * }
     */
    return this.dd.persist(this.entityName, this.serverData())
  }

  onSubmit(): void {
    /**
     * envio de formulario
     */
    this.isSubmitted = true;
    
    if (!this.adminForm.valid) {
      markAllAsTouched(this.adminForm);
      logValidationErrors(this.adminForm);
      this.toast.showInfo("Verificar formulario");
      this.isSubmitted = false;

    } else {
      var s = this.persist().subscribe(
        response => {
          if(response && response.length){
            this.storage.removeItemsContains(".");
            response.forEach(
              element => this.storage.removeItem(element)
            );
          }
          this.removeStorage();
          this.params$.next({id:this.getProcessedId(response)}); 
          /**
           * por mas que sea el mismo valor, se vuelve a asignar y se recarga el formulario
           */
          this.toast.showSuccess("Registro realizado");
          this.isSubmitted = false;
        },
        error => { 
          console.log(error);
          this.toast.showDanger(JSON.stringify(error.error)); 
        }
      );
      this.subscriptions.add(s);
    }
  }

  getProcessedId(logs: Array<any>) {  
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

  ngOnDestroy () { this.subscriptions.unsubscribe() } //eliminar subscripciones
}