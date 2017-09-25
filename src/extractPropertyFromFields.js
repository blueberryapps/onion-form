// @flow
import { reduceObject } from './helpers';
import type Immutable from 'seamless-immutable';

export default function extractPropertyFromFields(fields: Object | Immutable<*>, property: string): Object {
  return reduceObject(fields || {},
    (acc, properties, field) => ({
      ...acc,
      [field]: properties && properties[property] || null
    }),
    {}
  );
}
