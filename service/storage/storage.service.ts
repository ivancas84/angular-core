
export abstract class StorageService {

  constructor() { }

  getStorage(): any {
    return sessionStorage;
  }

  setItem(key: string, item: any): void {
    /**
     * @todo mejorar el control del storage completo: identificar el tipo de excepcion
     */
    try {
      this.getStorage().setItem(key, JSON.stringify(item));
    } catch (e) {
      this.getStorage().clear();
      this.getStorage().setItem(key, JSON.stringify(item));
    }
  }

  getItem(key: string): any {
      let data: any = this.getStorage().getItem(key);
      if (!data) return null;

      return JSON.parse(data);
  }

  removeItem(key): void { this.getStorage().removeItem(key); }

  clear(): void { this.getStorage().clear(); }

  keyExists(key: string): boolean {
    let s = this.getStorage();
    return (key in s) ? true : false;
  }

  removeItems(ids): void {
    let s = this.getStorage();
    for (let i in ids){
      if (ids.hasOwnProperty(i)) s.removeItem(ids[i]);
    }
  }

  removeItemsPrefix(prefix): void {
    console.log("voy a remover " + prefix)
    let s = this.getStorage(),
        keys = Object.keys(s);

    for (let i in keys){
      if (keys.hasOwnProperty(i)){
        if(keys[i].indexOf(prefix) === 0) s.removeItem(keys[i]);
      }
    }
  }

  removeItemsContains(str): void {
    let s = this.getStorage(),
        keys = Object.keys(s);

    for (let i in keys){
      if (keys.hasOwnProperty(i)){
        if(keys[i].indexOf(str) != -1) s.removeItem(keys[i]);
      }
    }
  }

}
