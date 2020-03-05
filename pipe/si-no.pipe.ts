import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: "siNo" })
export class SiNoPipe implements PipeTransform {
    transform(value: any): string {  return value ? 'Sí' : 'No'; };
}
