/**
 * Khai báo các reducer cho store
 */
import { compose } from '@ngrx/core/compose';

/**
 * storeLogger để log các action thao tác trên các store khác
 * - Chạy ở Dev mod để debug theo dõi các action
 */
import { storeLogger } from 'ngrx-store-logger';
import { combineReducers } from '@ngrx/store';

import { authReducer } from './auth/auth.reducer';
import { AuthState } from './auth/auth.state';

import { environment } from '../../../environments/environment.prod';

/**
 * As mentioned, we treat each reducer like a table in a database. This means
 * our top level state interface is just a map of keys to inner state types.
 */
export interface AppState {
  auth: AuthState;
}

const reducers = {
  auth: authReducer
};

const developmentReducer = compose(storeLogger(), combineReducers)(reducers);
const productionReducer = combineReducers(reducers);

export function reducer(state: any, action: any) {
  if (environment.production) {
    return productionReducer(state, action);
  } else {
    return developmentReducer(state, action);
  }
}
