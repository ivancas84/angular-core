
export function emptyUrl(url:string) { //eliminar queryParams de una url
    var index = url.indexOf('?');
    return (index != -1) ?  url.substring(0, index) : url;
}