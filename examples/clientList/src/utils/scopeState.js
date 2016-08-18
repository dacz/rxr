import immutable from 'object-path-immutable';

export const setScopedState = (state, scope, val) => immutable.set(state, scope, val);
