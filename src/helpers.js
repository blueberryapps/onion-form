/* @flow */
import Immutable from 'seamless-immutable';

type ValueMapper = (field: any, index: number) => any;

export function mapValues(structure: Object, mapper: ValueMapper): Object {
  const defaultObject: Object = Immutable.isImmutable(structure) ? Immutable({}) : {};
  const oldValues: any = Object.values(structure);
  const keys: Array<string> = Object.keys(structure);
  const newValues: any = oldValues.map(mapper);

  return newValues.reduce((acc: Object, value: any, index: number): Object => {
    const shape: Object = {
      ...acc,
      [keys[index]]: value
    };
    return Immutable.isImmutable(acc)
      ? Immutable(shape) : shape;
  }, defaultObject);
}

type KeysMapper = (key: string, index: number) => string;

export function mapKeys(structure: Object, mapper: KeysMapper): Object {
  const defaultObject: Object = Immutable.isImmutable(structure) ? Immutable({}) : {};
  const oldKeys: Array<string> = Object.keys(structure);
  const newKeys: Array<string> = oldKeys.map(mapper);
  return newKeys.reduce((acc: Object, key: string, index: number) => {
    const shape: Object = {
      ...acc,
      [key]: structure[oldKeys[index]]
    };
    return Immutable.isImmutable(acc)
      ? Immutable(shape) : shape;
  }, defaultObject);
}

type Reducer = (acc: Object, value: any, key: string, index:number, iter: Object) => Object;

export function reduceObject(structure: Object, reducer: Reducer, accumulator: any): any {
  const keys: Array<string> = Object.keys(structure);
  const values: Array<any> = keys.map(key => structure[key]);
  return values.reduce((acc: Object, value: any, index: number) =>
    reducer(acc, value, keys[index], index, structure), accumulator);
}
