import { Input, OnInit} from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder } from '@angular/forms';
import { isEmptyObject } from '@function/is-empty-object.function';
import { Observable, ReplaySubject } from 'rxjs';
import { Display } from '@class/display';
import { map } from 'rxjs/operators';

export abstract class SearchParamsComponent implements OnInit {
  /**
   * Componente anidado para definir busqueda a traves de parametros 
   */

  @Input() form: FormGroup; 
  /**
   * Formulario
   */

  @Input() display$: Observable<Display>;
  /**
   * Datos iniciales
   */
  
  load$: Observable<{[key: string]: string}>;
  /**
   * Parametros de Datos iniciales
   */

  fieldset: AbstractControl; 
  /**
   * fieldset
   */

  constructor( protected fb: FormBuilder ) { }

  abstract formGroup();

  ngOnInit() {    
    this.initForm();
    this.initOptions();
    this.initData();
  }

  initForm(): void{
    this.fieldset = this.formGroup();
    this.form.addControl("params", this.fieldset);
  }

  initOptions(): void{
    /**
     * sobrescribir si el formulario tiene opciones
     * asignarlas al atributo options
     */
  }

  initData(): void{    
    /**
     * Inicializar datos
     * Los valores por defecto se definen en el componente principal que utiliza el formulario de busqueda
     * Puede resultar necesario inicializar valores que seran posteriormente accedidos desde el storage
     */
    
    this.load$ = this.display$.pipe(map(
      display => {
        if(!isEmptyObject(display.getParams())) { this.fieldset.reset(display.getParams()) }
        return display.getParams()
      }
    ));
    
  }
 
}
