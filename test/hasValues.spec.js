import { fromJS } from 'immutable';

import hasValues from '../src/hasValues';

describe('hasValues()', () => {
  const state = {
    onionForm: fromJS({
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
