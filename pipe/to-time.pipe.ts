import { Pipe, PipeTransform } from '@angular/core';
import { ParserService } from '../service/parser/parser.service';

@Pipe({name: 'toTime'})
export class ToTimePipe implements PipeTransform {

  constructor(protected parser: ParserService) {}

  transform(value: string): Date {
    return this.parser.time(value);
  }
}
