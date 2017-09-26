import {
  mapValues,
  mapKeys,
  reduceObject
} from '../src/helpers';

describe('Helpers', () => {
  const testObject = {
    key1: 'prop1',
    key2: 'prop2'
  };
  it('Maps over object values', () => {
    const mapped = mapValues(testObject, value => `${value}-mapped`);
    const expected = {
      key1: 'prop1-mapped',
      key2: 'prop2-mapped'
    };
    expect(mapped).toEqual(expected);
  });

  it('Maps over object keys', () => {
    const mapped = mapKeys(testObject, key => `${key}-mapped`);
    const expected = {
      'key1-mapped': 'prop1',
      'key2-mapped': 'prop2'
    };
    expect(mapped).toEqual(expected);
  });

  it('Reduces object', () => {
    const reduced = reduceObject(testObject, (acc, value, key) => [...acc, [key, value]], []);
    const expected = [['key1', 'prop1'], ['key2', 'prop2']];
    expect(reduced).toEqual(expected);
  });
});
