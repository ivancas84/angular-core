import { Injectable } from '@angular/core';
import { NgbDateStruct, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateTimeStruct } from "src/app/core/class/ngb-date-time-struct";

@Injectable({
  providedIn: 'root'
})
export class ParserService {

  readonly MONTH_NAMES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  readonly MONTH_NAMES_SHORT = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];


  constructor() { }

  date(value: string): Date {
    if(!value) return null;

    switch(value){
      case null: return null;

      case "CURRENT_TIME": case "CURRENT_DATE": case "CURRENT_TIMESTAMP":
        var date: Date = new Date();
        //return date;
        return new Date(date.getTime())
        // + date.getTimezoneOffset() * 60 * 1000); //sumamos offset correspondiente a la hora local (offset_minutos * segundos * transformar_a_milisegundos)

      default:
        var date = new Date(value);
        //return date;
        return new Date(date.getTime())
        // + date.getTimezoneOffset() * 60 * 1000); //sumamos offset correspondiente a la hora local (offset_minutos * segundos * transformar_a_milisegundos)
    }
  }

  time(value: string): Date {
    if(!value) return null;

    switch(value){
      case null: return null;

      case "CURRENT_TIME": case "CURRENT_DATE": case "CURRENT_TIMESTAMP":
        var date: Date = new Date();
        //return date;
        return new Date(date.getTime())
        // + date.getTimezoneOffset() * 60 * 1000); //sumamos offset correspondiente a la hora local (offset_minutos * segundos * transformar_a_milisegundos)

      default:
        var dateAux = new Date();
        var date = new Date(this.dateFormat(dateAux) + " " + value);

        //return date;
        return new Date(date.getTime())
        // + date.getTimezoneOffset() * 60 * 1000); //sumamos offset correspondiente a la hora local (offset_minutos * segundos * transformar_a_milisegundos)
    }
  }

  //@param format (default Y-m-d)
  //  "d/m/Y",
  //  "NgbDateStruct": Retorna un objeto {day:number, month:number, year:number}, inspirado en el datepicker de bootstrap
  dateFormat(value: Date, format: string = null): any {
    if(!(value instanceof Date)) return null;

    //se asigna un numero a las variables porque sino tira error en compliacion: ubsequent variable declarations must have the same type
    switch(format){
      case "F": return this.MONTH_NAMES[value.getMonth()];

      case "d/m/Y":
        var yyyy = value.getFullYear().toString();
        var mm = (value.getMonth()+1).toString();
        var dd  = value.getDate().toString();
        return (dd[1]?dd:"0"+dd[0]) + "/" + (mm[1]?mm:"0"+mm[0]) + "/" + yyyy;


      case "NgbDateStruct":
        var yyyy2 = value.getFullYear();
        var mm2 = value.getMonth()+1;
        var dd2  = value.getDate();
        return {day:dd2, month:mm2, year:yyyy2};

      default:
        var yyyy3 = value.getFullYear().toString();
        var mm3 = (value.getMonth()+1).toString();
        var dd3  = value.getDate().toString();
        return yyyy3 + "-" + (mm3[1]?mm3:"0"+mm3[0]) + "-" + (dd3[1]?dd3:"0"+dd3[0]);
      }
  }

  //@param format (default Y-m-d)
  ngbDateStructFormat(date: NgbDateStruct, format: string = "Y-m-d"){
    if(!(date)) return null;

    var d = date.day.toString();
    var m = date.month.toString();
    var y = date.year.toString();

    switch(format) {
      default:
        return y + '-' + (m[1]?m:'0'+m[0]) + '-' + (d[1]?d:'0'+d[0]);
    }
  }

  //@param format (default H:i:s)
  ngbTimeStructFormat(time: NgbTimeStruct, format: string = "H:i:s"){
    if(!(time)) return null;

    var H = time.hour.toString();
    var i = time.minute.toString();
    var s = time.second.toString();

    switch(format) {
      default:
        return H + ':' + (i[1]?i:'0'+i[0]) + ':' + (s[1]?s:'0'+s[0]);
    }
  }

  //@param format (default Y-m-d H:i:s)
  ngbDateTimeStructFormat(datetime: NgbDateTimeStruct, format: string = "Y-m-d H:i:s"){
    if(!(datetime)) return null;

    var d = datetime.date.day.toString();
    var m = datetime.date.month.toString();
    var y = datetime.date.year.toString();
    var H = datetime.time.hour.toString();
    var i = datetime.time.minute.toString();
    var s = datetime.time.second.toString();

    switch(format) {
      default:
        return y + '-' + (m[1]?m:'0'+m[0]) + '-' + (d[1]?d:'0'+d[0]) + ' ' + H + ':' + (i[1]?i:'0'+i[0]) + ':' + (s[1]?s:'0'+s[0]);
    }
  }

  timestamp(value: string): Date {
    let date: Date = null;
    let time_ = null;
    let time = null;

    switch(value){
      case null: return null;

      case "CURRENT_TIME": case "CURRENT_DATE": case "CURRENT_TIMESTAMP":
        date = new Date();
        date.setSeconds(0);
        return date;
        //return new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);

      default:
        date = new Date(value);
        time_ = value.split(" ");
        time = time_[1].split(":");

        date.setHours(Number(time[0]));
        date.setMinutes(Number(time[1]));
        date.setSeconds(0);
        return date;
        //return new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
    }
  }


  //@param format (default h:i)
  //  "d/m/Y",
  //  "NgbTimeStruct": Retorna un objeto {hour:number, minute:number}, inspirado en el datepicker de bootstrap
  timeFormat(value: Date, format: string = null): any {
    if(!(value instanceof Date)) return null;


    //se asigna un numero a las variables porque sino tira error en compliacion: ubsequent variable declarations must have the same type
    switch(format){

      case "NgbTimeStruct":
        var h = value.getHours();
        var i = value.getMinutes();
        let time: NgbTimeStruct;
        time = { hour:h, minute:i, second:0 };
        return time;

      default:
        var h2 = value.getHours().toString();
        var i2 = value.getMinutes().toString();
        return (h2[1]?h2:"0"+h2[0]) + ":" + (i2[1]?i2:"0"+i2[0]);
    }
}

  //@param format (default Y-m-d)
  //  "d/m/Y",
  //  "NgbDateTimeStruct": Retorna un objeto compuesto {day:number, month:number, year:number} {hour:number, minute:number}, inspirado en el datepicker y timepicker de bootstrap
  timestampFormat(value: Date, format: string = null): any {
    if(!(value instanceof Date)){
      if(format = "NgbDateTimeStruct") {
        let date: NgbDateStruct;
        date = { day:null, month:null, year:null };
        let time: NgbTimeStruct;
        time = { hour:null, minute:null, second:null };
        return {date:date, time:time};
      }
      else { return null; }
    }

    //se asigna un numero a las variables porque sino tira error en compliacion: ubsequent variable declarations must have the same type
    switch(format){
      case "d/m/Y h:i":
        var d = this.dateFormat(value, "d/m/Y");
        var t = this.timeFormat(value, "h:i");
        return d + " " + t;

      case "NgbDateTimeStruct":
        var d = this.dateFormat(value, "NgbDateStruct");
        var t = this.timeFormat(value, "NgbTimeStruct");
        return {date:d, time:t};

      default:
        var d = this.dateFormat(value);
        var t = this.timeFormat(value);
        return d + " " + t;
    }
  }

}
