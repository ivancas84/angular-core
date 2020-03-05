import { Pipe, PipeTransform } from '@angular/core';
import { DataDefinitionService } from '@service/data-definition/data-definition.service';

@Pipe({name: 'label'})
export class LabelPipe implements PipeTransform {

  constructor(protected dd: DataDefinitionService) {}
  transform(value: string, entity: string): string { return this.dd.label(entity, value); }
}
