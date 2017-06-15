/** Khai các service provider */
import { AuthProvider } from './auth.provider';
import { CognitoAuthService } from './cognito-auth.service';

export function providers() {
  return [
    AuthProvider,
    CognitoAuthService
  ];
}
