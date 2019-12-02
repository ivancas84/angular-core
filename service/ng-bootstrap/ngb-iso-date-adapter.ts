import {Injectable} from '@angular/core';
import {NgbDateStruct, NgbDateAdapter} from '@ng-bootstrap/ng-bootstrap'

@Injectable()
export class NgbIsoDateAdapter extends NgbDateAdapter<string> {

  private pad(i: number) { return i < 10 ? `0${i}` : `${i}`; }

  fromModel(value: string): NgbDateStruct {
    if (!value) return null;
    const split = value.split('-');
    return {
      year: parseInt(split[0], 10),
      month: parseInt(split[1], 10),
      day: parseInt(split[2], 10)
    };
  }

  toModel(date: NgbDateStruct): string {
    console.log(date);
    if (!date) return null;
    return `${this.pad(date.year)}-${this.pad(date.month)}-${this.pad(date.day)}`;
  }

}
