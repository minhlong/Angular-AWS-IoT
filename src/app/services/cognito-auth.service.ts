/**
 * AWS Cognito Authenticate Service
 */

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { environment } from '../../environments/environment';

declare const AWS: any;
declare const AWSCognito: any;

export interface Callback {
  cognitoCallback(message: string, result: any): void;
}
export interface LoggedInCallback {
  isLoggedIn(message: string, loggedIn: boolean): void;
}

@Injectable()
export class CognitoAuthService {
  token: any;
  userData: any;

  /************ RESOURCE IDENTIFIERS *************/
  poolData = {
    UserPoolId: environment.userPoolId, // CognitoUserPool
    ClientId: environment.clientId, // CognitoUserPoolClient
    Paranoia: 7
  };
  identityPool: string = environment.identityPoolId; // CognitoIdentityPool
  region: string = environment.region; // Region Matching CognitoUserPool region
  /*********************************************/

  constructor(private _http: Http) {
    AWS.config.update({
      region: this.region,
      credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: ''
      })
    });
    AWSCognito.config.region = this.region;
    AWSCognito.config.update({ accessKeyId: 'null', secretAccessKey: 'null' });
  }

  getUserPool() {
    return new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(this.poolData);
  }

  /**
   * Authticate base on username/email and password
   *
   * @param user
   * @param password
   * @param callback
   */
  authenticate(user: string, password: string, callback: Callback) {
    const authenticationDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails({
      Username: user,
      Password: password,
    });
    const userPool = this.getUserPool()
    const cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser({
      Username: user,
      Pool: userPool
    });

    // After check, the result (suc/err) will be callback
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result) {
        callback.cognitoCallback(null, result);
      },
      onFailure: function (err) {
        callback.cognitoCallback(err, null);
      }
    });
  }

  /**
   * Check has been Logged In
   * @param callback
   */
  isAuthenticated(callback: LoggedInCallback) {
    const userPool = this.getUserPool();
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser != null) {
      cognitoUser.getSession(function (err, session) {
        if (err) {
          callback.isLoggedIn(err, false);
        } else {
          callback.isLoggedIn(err, session.isValid());
        }
      });
    } else {
      callback.isLoggedIn('Can\'t retrieve the CurrentUser', false);
    }
  }

  /**
   * Logout
   */
  logout() {
    const userPool = this.getUserPool();
    userPool.getCurrentUser().signOut();
  }
}
