/**
 * Cập nhật Store dựa vào các action
 */

import { ActionReducer, Action } from '@ngrx/store';
import { AuthState, defaultState } from './auth.state';
import { AuthActions } from '../../actions/auth.action';

export const authReducer: ActionReducer<AuthState> = (state: AuthState = defaultState, action: Action) => {
  switch (action.type) {

    // Các action sẽ cập nhật trạng thái đang loading
    case AuthActions.AUTH:
    case AuthActions.UNAUTHORIZED:
    case AuthActions.LOGOUT: {
      return Object.assign({}, state, {
        currentUser: null,
        loading: true,
        error: null
      });
    }

    // Các action sẽ cập nhật tài khoản đăng nhập (ngưng loading)
    case AuthActions.AUTH_COMPLETED:
    case AuthActions.CHECK_TOKEN_COMPLETED: {
      const user: any = action.payload;
      return Object.assign({}, state, {
        currentUser: user,
        loading: false,
        error: null
      });
    }

    // Các action sẽ cập nhật lỗi (xóa user, ngưng loading)
    case AuthActions.AUTH_FAILED: {
      const error: any = action.payload;
      return Object.assign({}, state, {
        currentUser: null,
        loading: false,
        error,
      });
    }

    // Reset store khi logout
    case AuthActions.LOGOUT_SUCCESS: {
      return Object.assign({}, state, {
        currentUser: null,
        loading: false,
        error: null
      });
    }

    default:
      return state;
  }
};
