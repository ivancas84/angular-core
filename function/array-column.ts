
export function arrayColumn(array, key) {
    return array.map(function(value) {
        return value[key];
    })
}