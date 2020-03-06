
export function arrayCombine(keys: Array<any>, values: Array<any>) {
    var ret = {}
    var i = 0
    
    if (keys.length !== values.length) return false;
    for (i = 0; i < keys.length; i++) ret[keys[i]] = values[i];
    return ret;
}