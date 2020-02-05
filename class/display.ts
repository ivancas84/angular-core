import { isEmptyObject } from '../function/is-empty-object.function';

export class Display {

  size: number = 100;
  page: number = 1;
  order: Object = {};
  condition: Array<any> = [];
  params?: Object = {} //busqueda adicional

  public describe(){
    let ret = {};
    if(this.size) ret["size"] = this.size;
    if(this.page) ret["page"] = this.page;
    if(!isEmptyObject(this.order)) ret["order"] = this.order;
    if(this.condition.length) ret["condition"] = this.condition;
    //if(!isEmptyObject(this.param)) ret["param"] = this.param;
    if(!isEmptyObject(this.params)) ret["params"] = this.params;
    return ret;
  }

  public setParams(params: any){
    this.params = {};
    for(var i in params){
      if (params.hasOwnProperty(i)){
        if(params[i]) this.params[i] = params[i];
      }
    }    
  }

  public setByParams(params: any){
  /**
   * Transforma los parametros en condiciones
   */
    for(let i in params) {
      if(params.hasOwnProperty(i)) {
        if(!(i in this)) this.condition.push([i, "=", params[i]]); //asignar filtro
        else this[i] = JSON.parse(decodeURI(params[i])); //asignar parametro
      }
    }
  }

  public setConditionFilters(filters: Array<any>){    
    for(let i = 0; i < filters.length; i++){
      if(filters[i]["value"] !== undefined) this.condition.push([filters[i]["field"], filters[i]["option"], filters[i]["value"]]);
    }    
  }

  public setOrder(params: any){
    /**
     * argumentos dinamicos: nombres de campos
     */
    var keys = Object.keys(this.order);

    if((keys.length) && (params[0] == keys[0])){
      var type: string = (this.order[keys[0]].toLowerCase() == "asc") ? "desc" : "asc";
      this.order[keys[0]] = type;
    } else {
      var obj = {}
      for(var i = 0; i < params.length; i++) obj[params[i]] = "asc";
      this.order = Object.assign(obj, this.order);
    }
  }

  public encodeURI(){
    let d = [];
    for(var key in this.describe()){ //Se accede al metodo display.describe() para ignorar los filtros no definidos
      if(this.hasOwnProperty(key)){
        if(this[key]){
          d.push(key + "=" + encodeURI(JSON.stringify(this[key])));
        }
      }
    }
    return d
  }
}
