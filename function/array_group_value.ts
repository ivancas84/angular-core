
export function arrayGroupValue(arr: Array<any>, key: any) { //eliminar queryParams de una url
    var ret = {};
    arr.forEach(element => {
        var v = element[key];
        if(!ret.hasOwnProperty(v)) ret[v] = [];
        ret[v].push(element);
    });
    return ret;
}