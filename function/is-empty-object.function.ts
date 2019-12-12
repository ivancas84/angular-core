
export function isEmptyObject(obj:any) { 
  /**
   * check if object is empty
   */
  if(!obj) return true;
  if(obj.isArray) {
    (obj.length) ? false : true;
  }
  for(var key in obj) {
      if(obj.hasOwnProperty(key)) return false;
  }
  return true;
}
