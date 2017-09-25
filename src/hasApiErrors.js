// @flow
import extractPropertyFromState from './extractPropertyFromState';
import type { StateType } from './types';

export default function hasApiErrors(state: StateType, name: string) {
  const errors = Object.values(extractPropertyFromState(state, name, 'apiError'));

  return (errors.filter(e => typeof e === 'string' && e.length > 0).length > 0);
}
