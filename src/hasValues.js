// @flow
import extractPropertyFromState from './extractPropertyFromState';
import type { StateType } from './types';

export default function hasValues(state: StateType, name: string): boolean {
  const errors = Object.values(extractPropertyFromState(state, name, 'value'));

  return (errors.filter(v => v !== undefined && v !== null).length > 0);
}
