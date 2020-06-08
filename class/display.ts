import { isEmptyObject } from '../function/is-empty-object.function';

export class Display {

  protected size: number = null;
  /**
   * size se establece por defecto en el servidor y en el componente de paginacion en 100
   */

  protected page: number = 1;
  /**
   * inicializar page siempre para evitar errores en los componentes de paginacion
   */

  protected order: Object = {};
  protected condition: Array<any> = [];
  protected params?: Object = {} //busqueda adicional
  /** 
   * El servidor limita siempre la cantidad de elementos (size) a 100
   * Si se desea un valor mayor debe definirse explicitamente en el servidor
   */

  public getSize(){ return this.size }
  public getPage(){ return this.page }
  public getOrder(){ return this.order }
  public getCondition(){ return this.condition }
  public getParams(){ return this.params }
  
  public setSize(size: number) { this.size = size; }
  public setPage(page: number) { this.page = page; }
  public addCondition(condition){ this.condition.push(condition); }
  public setCondition(condition){ this.condition = condition; }
  
  public describe(){
    let ret = {};
    if(this.size || (this.size === 0)) ret["size"] = this.size;
    if(this.page) ret["page"] = this.page;
    if(!isEmptyObject(this.order)) ret["order"] = this.order;
    if(this.condition.length) ret["condition"] = this.condition;
    if(!isEmptyObject(this.params)) ret["params"] = this.params;
    return ret;
  }

  public setParams(params: object){
    this.params = {};
    for(var i in params){
      if (params.hasOwnProperty(i)){
        if(params[i]) this.params[i] = params[i];
      }
    }    
  }

  public addParam(key: string, value: any){
    this.params[key] = value;
  }

  public addParamIfNot(key: string, value: any){
    if(this.params.hasOwnProperty(key)) return;
    this.params[key] = value;
  }

  public addConditionIfNot(condition: Array<any>){
    for(var i in this.condition){
      if(this.condition[i][0] == condition[0] && this.condition[i][1] == condition[1] ) return;
    }

    this.addCondition(condition);
  }

  public setConditionByQueryParams(params: any){
  /**
   * Transformar "queryParams" en conditions
   */
    for(let i in params) {
      if(params.hasOwnProperty(i)) {
        if(!(this.hasOwnProperty(i))) this.addCondition([i, "=", params[i]]); //asignar filtro
        else this[i] = JSON.parse(decodeURI(params[i])); //asignar parametro
      }
    }
  }

  
  public setParamsByQueryParams(params: any){
    /**
     * Transformar "queryParams" en conditions
     */
      for(let i in params) {
        if(params.hasOwnProperty(i)) {
          if(!(this.hasOwnProperty(i))) this.addParamIfNot(i, params[i]); //asignar filtro
          else this[i] = JSON.parse(decodeURI(params[i])); //asignar parametro
        }
      }
    }


  public setConditionFilters(filters: Array<any>){    
    for(let i = 0; i < filters.length; i++){
      if(filters[i]["value"] !== undefined) this.condition.push([filters[i]["field"], filters[i]["option"], filters[i]["value"]]);
    }    
  }

  public setOrderByKeys(params: Array<string>){
    /**
     * argumentos dinamicos: nombres de campos
     */
    var keys = Object.keys(this.order);
    var keys2 = Object.keys(params)

    if((keys.length) && (keys2[0] == keys[0])){
      var type: string = (this.order[keys[0]].toLowerCase() == "asc") ? "desc" : "asc";
      this.order[keys[0]] = type;
    } else {
      //var obj = {}
      //for(var i = 0; i < keys2.length; i++) obj[keys2[i]] = params[keys2[i]];
      this.order = Object.assign(params, this.order);
    }
  }

  
  public setOrder(params: Object){
    /**
     * argumentos dinamicos: nombres de campos
     */
    var keys = Object.keys(this.order);
    var keys2 = Object.keys(params)

    if((keys.length) && (keys2[0] == keys[0])){
      var type: string = (this.order[keys[0]].toLowerCase() == "asc") ? "desc" : "asc";
      this.order[keys[0]] = type;
    } else {
      //var obj = {}
      //for(var i = 0; i < keys2.length; i++) obj[keys2[i]] = params[keys2[i]];
      this.order = Object.assign(params, this.order);
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
    return d.join("&")
  }
}
