import { fromJS } from 'immutable';

import extractPropertyFromFields from '../src/extractPropertyFromFields';

describe('extractPropertyFromFields()', () => {
  const fields = fromJS({
    foo: { value: 'Bar', missingProp: true },
    bar: { value: 'Foo', }
  });

  it('extract property from null fields', () => {
    expect(extractPropertyFromFields(null, 'value')).toEqual({});
  });

  it('extract property from form fields', () => {
    expect(extractPropertyFromFields(fields, 'value')).toEqual({
      foo: 'Bar',
      bar: 'Foo'
    });
  });

  it('extract property from form fields which is sometimes missing', () => {
    expect(extractPropertyFromFields(fields, 'missingProp')).toEqual({
      foo: true,
      bar: null
    });
  });
});
