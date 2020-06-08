import { Input, OnInit} from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder } from '@angular/forms';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';
import { ValidatorsService } from '@service/validators/validators.service';
import { isEmptyObject } from '@function/is-empty-object.function';
import { Observable, ReplaySubject } from 'rxjs';

export abstract class SearchParamsComponent implements OnInit {
  /**
   * Componente anidado de Busqueda para definir busqueda a traves de parametros 
   */

  @Input() form: FormGroup; 
  /**
   * Formulario
   */

  @Input() params$: ReplaySubject<any>;
  /**
   * Datos iniciales
   */

  options: Observable<any>; 
  /**
   * opciones para el formulario
   */
  
  fieldset: AbstractControl; 
  /**
   * fieldset
   */

  constructor(
    protected fb: FormBuilder, 
    protected dd: DataDefinitionService, 
    protected validators: ValidatorsService) 
  { }

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
    this.params$.subscribe(
      response => {
        if(!isEmptyObject(response)) { this.fieldset.reset(response) }
      }
    );
  }
 
}
