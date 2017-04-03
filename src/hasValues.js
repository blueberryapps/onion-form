import extractPropertyFromState from './extractPropertyFromState';

export default function hasValues(state, name) {
  const errors = Object.values(extractPropertyFromState(state, name, 'value'));

  return (errors.filter(v => v !== undefined && v !== null).length > 0);
}
