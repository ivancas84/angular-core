import { Component, Input, OnInit } from '@angular/core';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Display } from '@class/display';
import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs';


export abstract class FormPickComponent implements OnInit {
  
  @Input() field: FormControl;
  @Input() readonly?: boolean = false;
  readonly entityName: string;
  form: FormGroup;
  protected subscriptions = new Subscription();
  /**
   * las subscripciones son almacenadas para desuscribirse (solucion temporal al bug de Angular)
   * @todo En versiones posteriores de angular, eliminar el atributo subscriptions y su uso
   */

  constructor(protected fb: FormBuilder, protected dd: DataDefinitionService) { }
  
  ngOnInit() {    
    this.formGroup();
    this.initOptions();
    this.valueChangesField();
    this.valueChangesForm();
  }

  abstract formGroup(): void;
  /**
   * this.form = this.fb.group({ ... controls ... });
   */

  initOptions(): void {
    /**
     * sobrescribir si el formulario tiene opciones
     */
  }

  initValue(value){
    this.dd.getOrNull(this.entityName, value).pipe(first()).subscribe(
      row => {
        if(row) { 
          this.form.reset(row);
          this.form.disable();
        } else {
          this.form.reset();
          if(!this.readonly) this.form.enable();
        }
      }
    );
  }
  
  valueChangesField(): void {
    if(this.field.value) this.initValue(this.field.value);

    var s = this.field.valueChanges.subscribe(
      value => this.initValue(value)
    );

    this.subscriptions.add(s);
  }

  valueChangesForm(): void {
    var s = this.form.valueChanges.subscribe(
      value => {
        var display = new Display
        for (var key in value) {
          if(!value.hasOwnProperty(key) || !value[key]) return;
          display.addParam(key, value[key]);
        }
        this.field.markAsPending();
        this.dd.all(this.entityName, display).subscribe(
          (res) => {
            this.field.setValue(res.id);
            this.field.markAsDirty();
          }
        );
      },
      (err) => {  
        console.log(err);
      }
    );

    this.subscriptions.add(s);
  }
  
  ngOnDestroy () { this.subscriptions.unsubscribe() }

}
