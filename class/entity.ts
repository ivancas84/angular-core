export abstract class Entity {
  id: string = null; 
  /**
   * Conviene asignar las propiedades en null 
   */

  

  public initialize(params = null) { //inicializar datos en base a parametros
   /**
    * Por defecto los parametros se asignan a una instancia de la entidad principal    
    * Si la entidad principal no posee el parametro el mismo es ignorado
    * Si existe otro tipo de parametros debera sobrescribirse el metodo
    */
   if(params){
     for (var p in params){
       if (params.hasOwnProperty(p)){          
         if(this.hasOwnProperty(p)){
           this[p] = params[p];
         }
       }
     }
   }
 }

  protected _uniqueId(): string {
    var start = new Date().getTime();
    while (new Date().getTime() < start + 1); //esperar un microsegundo para evitar colisiones en caso de multiples llamados al metodo TODO: Reemplazar por sleep o await o async cuando este implementado

    var date = Date.now().toString();
    var number =  (Math.floor(Math.random()*10000)).toString(); //numero aleatorio de 4 posisiones
    if ( (4 - number.length) > 0 ) number = "0" + number;
    return date+number;
  }

  //public abstract setJson(row: { [index: string]: boolean|string|number });
  //public abstract  initForm(row: { [index: string]: any } = null);
  //public abstract toJson();
  //public abstract toForm();
  protected _stringToDate(value: string): Date {
    switch(value){
      case null: return null;

      case "CURRENT_TIME": case "CURRENT_DATE": case "CURRENT_TIMESTAMP":
        let date: Date = new Date();
        return date;
        //return new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000); //sumamos offset correspondiente a la hora local (offset_minutos * segundos * transformar_a_milisegundos)

      default:
        date = new Date(value);
        return date;
        //return new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000); //sumamos offset correspondiente a la hora local (offset_minutos * segundos * transformar_a_milisegundos)
    }
  }

  protected _stringToTimestamp(value: string): Date {
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

    protected _dateToString(date: Date): string { //transformar un date a un string
      let month: string = '' + (date.getMonth() + 1);
      let day: string = '' + date.getDate();
      let year: string = '' + date.getFullYear();

      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;

      return [year, month, day].join('-');
    }

    protected _timestampToString(timestamp: Date): string{ //transformar un date a un string
      let date = this._dateToString(timestamp);
      let hours: string = '' + timestamp.getHours();
      let minutes: string = '' + timestamp.getMinutes();
      let seconds: string = '' + timestamp.getSeconds();

      if (hours.length < 2) hours = '0' + hours;
      if (minutes.length < 2) minutes = '0' + minutes;
      if (seconds.length < 2) seconds = '0' + seconds;

      return date + " " + [hours, minutes, seconds].join(':');
    }


}
