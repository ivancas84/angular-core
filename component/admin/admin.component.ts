import { FormGroup, FormBuilder, AbstractControl, FormControl, FormArray, ValidationErrors } from '@angular/forms';
import { ReplaySubject, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';
import { MessageService } from '@service/message/message.service';
import { ValidatorsService } from '@service/validators/validators.service';
import { first } from 'rxjs/operators';
import { Location } from '@angular/common';
import { emptyUrl } from '@function/empty-url.function';
import { SessionStorageService } from '@service/storage/session-storage.service';


export abstract class AdminComponent {
/**
 * Formulario de administracion FormGroup (adminForm) cuyos elementos son tambien FormGroups correspondientes a los fieldsets
 * Se recomienda no modificar el id de la tabla principal en las actualizaciones
 */

  adminForm: FormGroup = this.fb.group({});
  /**
   * formulario
   * se asignaran dinamicamente los formgroups correspondientes a fieldsets
   */

  readonly entity: string;
  /**
   * entidad principal
   */

  readonly sync: { [index: string]: boolean } = null;
  /**
   * datos de sincronizacion
   */
  
  data$ = new ReplaySubject();
  /**
   * datos del formulario
   */

  params$ = new ReplaySubject();
  /**
   * parametros
   */

  deleteDisabled: boolean =  true;
  /**
   * flag para habilitar/deshabilitar boton eliminar
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
    protected message: MessageService, 
    protected validators: ValidatorsService,
    protected storage: SessionStorageService, 
  ) {}
  
  ngOnInit() {
    var s = this.adminForm.valueChanges.subscribe (
      formValues => { this.storage.setItem(this.router.url, formValues); },
      error => { this.message.add(JSON.stringify(error)); }
    );
    this.subscriptions.add(s); 

    var s = this.params$.subscribe (
      params => {
        let formValues = this.storage.getItem(this.router.url);
        this.removeStorage();
        if(formValues) this.setDataFromStorage(formValues);
        else if(params) this.setDataFromParams(params);
      },
      error => { this.message.add(JSON.stringify(error)); }
    )
    this.subscriptions.add(s);
    
    var s = this.route.queryParams.subscribe (
      params => { this.params$.next(params); },
      error => { this.message.add(JSON.stringify(error)); }
    );
    this.subscriptions.add(s);
  }

  setDataFromStorage(formValues: any): void{
    var d = formValues.hasOwnProperty(this.entity)? formValues[this.entity] : null;
    this.data$.next(d);   
  }

  setDataFromParams(params: any): void {
    if(!params) {
      this.data$.next(null);
      return;
    } 
    this.dd.uniqueOrNull(this.entity, params).pipe(first()).subscribe(
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

  delete() { console.log("No implementado"); }

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
    var s = this.params$.subscribe(
      params => { this.setDataFromParams(params); },
      error => { this.message.add(JSON.stringify(error)); }
    )
    this.subscriptions.add(s);
  }
  

  onSubmit(): void { //envio de formulario

    if (!this.adminForm.valid) {
      //this.logValidationErrors(this.adminForm);
      this.markAllAsTouched(this.adminForm); //Marcar todos los elementos como touched para visualizar errores
      this.message.add("Complete correctamente los campos del formulario");
    } else {
      this.adminForm.disable();

      var data = this.getDataFromForm();    

      var s = this.dd.process(this.entity, data).subscribe(
        processResult => {
          this.adminForm.enable();
          this.params$.next({id:this.getIdProcessed(processResult)})        
        },
        error => { this.message.add(JSON.stringify(error)); }
      );
      this.subscriptions.add(s);
      }
  }

  getDataFromForm(){ //definir datos que seran enviados para su procesamiento
    let serverData: any[] = [];
    serverData.push({entity:this.entity, row:this.adminForm.value[this.entity]});
    return serverData;
  }

  getIdProcessed(processResult: any){ return processResult[0].id; } //obtener id de la respuesta
  /**
   * Los formularios complejos pueden obtener el id de diferentes formas
   */

  markAllAsTouched(control: AbstractControl) { //marcar todos los elementos del formulario como touched para visualizar errores
    if(control.hasOwnProperty('controls')) {
        control.markAsTouched({ onlySelf: true }) // mark group
        let ctrl = <any>control;
        for (let inner in ctrl.controls) this.markAllAsTouched(ctrl.controls[inner] as AbstractControl);
    }
    else (<FormControl>(control)).markAsTouched({ onlySelf: true });
  }

  logValidationErrors(formGroup) { //log de errores del formulario
    /**
     * Utilizado opcionalmente para propositos de Debug
     */
    Object.keys(formGroup.controls).forEach(key => {

      const control = formGroup.get(key);

      if(control instanceof FormGroup ) console.log("FormGroup " + key);

      if(control instanceof FormArray ) {
        console.log("FormArray " + key);

        for (let i = 0; i < control.controls.length; i++){
          console.log("+ index " + i);
          this.logValidationErrors(control.controls[i]);
        }
      }

      const controlErrors: ValidationErrors = formGroup.get(key).errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          console.log('* ERROR: ' + key + ' - ' + keyError + ':' + controlErrors[keyError]);
        });
      }
    });
  }

  ngOnDestroy () { this.subscriptions.unsubscribe() } //eliminar subscripciones
}