import { Input, OnInit} from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder } from '@angular/forms';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';
import { ValidatorsService } from '@service/validators/validators.service';
import { isEmptyObject } from '@function/is-empty-object.function';
import { Observable, forkJoin } from 'rxjs';
import { FieldsetComponent } from '@component/fieldset/fieldset.component';

export abstract class SearchParamsComponent extends FieldsetComponent implements OnInit {
  
  constructor(
    protected fb: FormBuilder, 
    protected dd: DataDefinitionService, 
    protected validators: ValidatorsService) 
  { super(fb, dd, validators); }

  initForm(): void{
    this.fieldset = this.formGroup();
    this.form.addControl("params", this.fieldset);
  }
 
}
