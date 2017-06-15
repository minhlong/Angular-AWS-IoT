/**
 * AWS Cognito Authenticate Service
 */

import { Injectable } from '@angular/core';
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
  static token: any;
  static userCredentialData: any;

  /************ RESOURCE IDENTIFIERS *************/
  private poolData = {
    UserPoolId: environment.userPoolId, // CognitoUserPool
    ClientId: environment.clientId // CognitoUserPoolClient
  };
  private identityPool: string = environment.identityPoolId; // CognitoIdentityPool
  private region: string = environment.region; // Region Matching CognitoUserPool region
  /*********************************************/

  constructor() {
    AWS.config.update({
      region: this.region,
      credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: ''
      })
    });
    AWSCognito.config.region = this.region;
    AWSCognito.config.update({ accessKeyId: 'null', secretAccessKey: 'null' });
  }

  private getUserPool() {
    return new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(this.poolData);
  }

  /**
   * Update information for use in another services
   * Token, Credentials,...
   */
  private updateUserData(session: any) {
    // Update token
    CognitoAuthService.token = session.getIdToken().getJwtToken()

    // Update AWS Credentials for use in another services
    const cognitoParams = {
      IdentityPoolId: this.identityPool,
      Logins: {}
    };
    cognitoParams.Logins['cognito-idp.' + this.region + '.amazonaws.com/' + this.poolData.UserPoolId] = CognitoAuthService.token;
    AWS.config.credentials = new AWS.CognitoIdentityCredentials(cognitoParams);
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
    const that = this;
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (session) {
        callback.cognitoCallback(null, session);

        // Save token for JWT
        localStorage.setItem('token', session.getIdToken().getJwtToken());

        // Update information for use in another services
        that.updateUserData(session);
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
      const that = this;
      cognitoUser.getSession(function (err, session) {
        if (err) {
          callback.isLoggedIn(err, false);
        } else {
          callback.isLoggedIn(err, session.isValid());

          // Update information for use in another services
          that.updateUserData(session);
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
    // Remove JWT Token
    localStorage.removeItem('token');

    // const userPool = this.getUserPool();
    // userPool.getCurrentUser().signOut();
  }
}
