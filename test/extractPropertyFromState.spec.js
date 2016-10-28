import extractPropertyFromState from '../src/extractPropertyFromState';
import { assert } from 'chai';
import { fromJS } from 'immutable';

describe('extractPropertyFromState()', () => {
  const state = {
    onionForm: fromJS({
      fields: {
        Form1: {
          foo: { value: 'Bar', missingProp: true },
          bar: { value: 'Foo', }
        }
      }
    })
  };

  it('extract property from nonexisting form', () => {
    assert.deepEqual(
      extractPropertyFromState(state, 'NonexistingForm', 'value'),
      {}
    );
  });

  it('extract property from form fields', () => {
    assert.deepEqual(
      extractPropertyFromState(state, 'Form1', 'value'),
      {
        foo: 'Bar',
        bar: 'Foo'
      }
    );
  });

  it('extract property from form fields which is sometimes missing', () => {
    assert.deepEqual(
      extractPropertyFromState(state, 'Form1', 'missingProp'),
      {
        foo: true,
        bar: null
      }
    );
  });
});
