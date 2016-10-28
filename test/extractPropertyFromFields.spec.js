import extractPropertyFromFields from '../src/extractPropertyFromFields';
import { assert } from 'chai';
import { fromJS } from 'immutable';

describe('extractPropertyFromFields()', () => {
  const fields = fromJS({
    foo: { value: 'Bar', missingProp: true },
    bar: { value: 'Foo', }
  });

  it('extract property from null fields', () => {
    assert.deepEqual(
      extractPropertyFromFields(null, 'value'),
      {}
    );
  });

  it('extract property from form fields', () => {
    assert.deepEqual(
      extractPropertyFromFields(fields, 'value'),
      {
        foo: 'Bar',
        bar: 'Foo'
      }
    );
  });

  it('extract property from form fields which is sometimes missing', () => {
    assert.deepEqual(
      extractPropertyFromFields(fields, 'missingProp'),
      {
        foo: true,
        bar: null
      }
    );
  });
});
