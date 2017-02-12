import extractPropertyFromState from './extractPropertyFromState';

export default function hasApiErrors(state, name) {
  const errors = Object.values(extractPropertyFromState(state, name, 'apiError'));

  return (errors.filter(e => e && e.length > 0).length > 0);
}
