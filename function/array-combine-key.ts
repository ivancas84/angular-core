import { arrayCombine } from '@function/array-combine';
import { arrayColumn } from '@function/array-column';

export function arrayCombineKey(values: Array<any>, key: string) {
    return arrayCombine(arrayColumn(values, key), values);
}