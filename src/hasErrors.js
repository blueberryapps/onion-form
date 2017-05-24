// @flow
import extractPropertyFromState from './extractPropertyFromState';
import type { StateType } from './types';

export default function hasErrors(state: StateType, name: string): boolean {
  const errors = Object.values(extractPropertyFromState(state, name, 'error'));

  return (errors.filter(e => (typeof e === 'string' && e.length > 0)).length > 0);
}
