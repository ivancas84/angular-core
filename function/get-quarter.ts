
export function getQuarter(d: Date = null) {
d = d || new Date();
var m = Math.floor(d.getMonth()/3) + 2;
return m > 4? m - 4 : m;
}