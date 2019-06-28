import { FieldsetComponent } from '../fieldset/fieldset.component';
import { Output, EventEmitter } from '@angular/core';

export abstract class FieldsetOptionalComponent extends FieldsetComponent {

  disableFieldset = true;

  toggleFieldset(){
    this.disableFieldset = !this.disableFieldset;
    (this.disableFieldset) ? this.fieldset.disable() : this.fieldset.enable();
  }

  
  ngOnInit() {
    this.options = this.dd.options(this.entityName, this.sync);
    this.fieldset = this.formGroup();
    this.form.addControl(this.fieldsetName, this.fieldset);
    this.data$.subscribe(
      values => { 
        if(values) {
          this.fieldset.enable();
          this.fieldset.reset(values);
          this.disableFieldset = false;
        } else {
          this.fieldset.disable();
          this.disableFieldset = true
        }        
      }
    );
  }
}
