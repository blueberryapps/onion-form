import hasValues from '../src/hasValues';
import Immutable from 'seamless-immutable';

describe('hasValues()', () => {
  const state = {
    onionForm: Immutable({
      fields: {
        WithValue: {
          foo: { value: 'required' },
          bar: { }
        },
        NoValue: {
          foo: { value: null },
          bar: { }
        },
        NoFields: {}
      }
    })
  };

  it('form with at least one field with value', () => {
    expect(hasValues(state, 'WithValue')).toBe(true);
  });

  it('form with fields with null value', () => {
    expect(hasValues(state, 'NoValue')).toBe(false);
  });

  it('form with no fields', () => {
    expect(hasValues(state, 'NoFields')).toBe(false);
  });
});
