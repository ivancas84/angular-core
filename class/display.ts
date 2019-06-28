import { isEmptyObject } from '../function/is-empty-object.function';

export class Display {

  size: number = 100;
  page: number = 1;
  search: string = "";
  order: Object = {};
  filters: Array<any> = [];
  history: boolean = null;

  params: Object = {}; //forma corta para definir filters
  export?: string = null;

  aux?: Object = {} //parametros adicionales

  describe(){
    let ret = {};
    if(this.size) ret["size"] = this.size;
    if(this.page) ret["page"] = this.page;
    if(this.search && this.search != "") ret["search"] = this.search;
    if(!isEmptyObject(this.order)) ret["order"] = this.order;
    if(this.filters.length) ret["filters"] = this.filters;
    if(this.history) ret["history"] = this.history;
    if(this.export) ret["export"] = this.export;
    if(!isEmptyObject(this.params)) ret["params"] = this.params;
    if(!isEmptyObject(this.aux)) ret["aux"] = this.aux;
    return ret;
  }
}
