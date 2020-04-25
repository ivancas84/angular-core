import { Input } from '@angular/core';
import { Observable } from 'rxjs';

export abstract class CardComponent {

  @Input() data$: Observable<any>; 
  /**
   * datos principales
   */
  
}
