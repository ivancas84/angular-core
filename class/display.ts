import { isEmptyObject } from '../function/is-empty-object.function';

export class Display {

  size: number = 100;
  page: number = 1;
  order: Object = {};
  condition: Array<any> = [];

  param: Object = {}; //forma corta para definir conditions
  export?: string = null;

  aux?: Object = {} //parametros adicionales

  describe(){
    let ret = {};
    if(this.size) ret["size"] = this.size;
    if(this.page) ret["page"] = this.page;
    if(!isEmptyObject(this.order)) ret["order"] = this.order;
    if(this.condition.length) ret["condition"] = this.condition;
    if(this.export) ret["export"] = this.export;
    if(!isEmptyObject(this.param)) ret["param"] = this.param;
    if(!isEmptyObject(this.aux)) ret["aux"] = this.aux;
    return ret;
  }
}
