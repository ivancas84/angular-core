import { FieldsetComponent } from '@component/fieldset/fieldset.component';

export abstract class FieldsetOptionalComponent extends FieldsetComponent {

  initData(): void{    
    this.data$.subscribe(
      response => {
        if(response) {
          this.fieldset.enable();
          this.fieldset.reset(response);
        } else {
          this.fieldset.disable();  
        }        
      }
    );
  }
}
