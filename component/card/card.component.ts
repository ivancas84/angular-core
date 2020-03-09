import { Input } from '@angular/core';

export abstract class CardComponent {
  /**
   * Componente card de entidad. Características:
   *   los datos son definidos en componente principal (padre) y pasados como parametro
   */

  @Input() data$: any; 
  /**
   * Datos del formulario
   */

}
