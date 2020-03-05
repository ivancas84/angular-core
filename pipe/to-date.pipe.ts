import { Pipe, PipeTransform } from '@angular/core';
import { ParserService } from '../service/parser/parser.service';

@Pipe({name: 'toDate'})
export class ToDatePipe implements PipeTransform {

  constructor(protected parser: ParserService) {}

  transform(value: string): Date {
    return this.parser.date(value);
  }
}
