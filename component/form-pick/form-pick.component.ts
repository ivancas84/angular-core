import { Component, Input, OnInit } from '@angular/core';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Display } from '@class/display';


export abstract class FormPickComponent implements OnInit {
  
  readonly entityName: string;
  
  @Input() fieldName: string;

  @Input() fieldset: FormGroup;
  /**
   * Fieldset al que pertenece fieldName
   * Al cargar y procesar el archivo se asignara posteriormente el id resultante a fieldset.fieldName.value
   */

  form: FormGroup;

  constructor(private fb: FormBuilder, private dd: DataDefinitionService) { }
  
  ngOnInit() {    
    this.initForm();
    this.valueChanges();
    //this.initOptions();
    //this.initData();
  }

  abstract initForm();
  /**
   * this.form = this.fb.group({ ... controls ... });
   */
  
  valueChanges(): void {
    this.form.valueChanges.subscribe(
      value => {
        var display = new Display
        for (var key in value) {
          if(!value[key]) return;
          display.addParam(key, value);
          this.field.markAsPending();
          this.dd.all(this.entityName, display).subscribe(
            (res) => {
              this.field.setValue(res.id);
              this.field.markAsDirty();
            }
          );
        }
      },
      (err) => {  
        console.log(err);
      }
    )
  }

  get field() { return this.fieldset.get(this.fieldName)}

}
