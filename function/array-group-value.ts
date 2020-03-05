
export function arrayGroupValue(arr: Array<any>, key: any) {
    var ret = {};
    arr.forEach(element => {
        var v = element[key];
        if(!ret.hasOwnProperty(v)) ret[v] = [];
        ret[v].push(element);
    });
    return ret;
}