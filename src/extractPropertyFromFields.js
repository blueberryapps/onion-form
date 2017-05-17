import { reduceObject } from './helpers';

export default function extractPropertyFromFields(fields, property) {
  return reduceObject(fields || {},
    (acc, properties, field) => ({
      ...acc,
      [field]: properties && properties[property] || null
    }),
    {}
  );
}
