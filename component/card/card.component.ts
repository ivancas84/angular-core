import { Input } from '@angular/core';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';
import { Observable } from 'rxjs';

export abstract class CardComponent {
  /**
   * Componente card de entidad. Características:
   *   los datos son definidos en componente principal (padre) y pasados como parametro
   */

  @Input() data$: any; 
  /**
   * Datos del formulario
   */

  readonly entityName: string; 
  /**
   * entidad principal del componente  
   */

  options: Observable<any>; 
  /**
   * opciones para el formulario
   */

  constructor(
    protected dd: DataDefinitionService, 
  ) { }
}
