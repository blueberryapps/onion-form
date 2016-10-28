import extractPropertyFromState from './extractPropertyFromState';

export default function hasErrors(state, name) {
  const errors = Object.values(extractPropertyFromState(state, name, 'error'));

  return (errors.filter(e => e && e.length > 0).length > 0);
}
