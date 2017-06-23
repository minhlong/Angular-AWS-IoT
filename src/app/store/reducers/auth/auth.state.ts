/**
 * Define the state for Auth
 */

export interface AuthState {
  loading: boolean;
  currentUser: any;
  error: string;
}

export const defaultState: AuthState = {
  loading: false,
  currentUser: null,
  error: null
};
