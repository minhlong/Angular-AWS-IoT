import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { environment } from '../../environments/environment';
import { JwtHelper } from 'angular2-jwt';
import { consoleLog } from '../app.helpers';

declare const AWS: any;
declare const AWSCognito: any;

export interface AuthServiceProvider {
  authenticate(user: string, password: string): Observable<any>;
  logout(): void;
}

@Injectable()
export class AuthCognitoService implements AuthServiceProvider {
  private jwtHelper: JwtHelper = new JwtHelper();

  /************ RESOURCE IDENTIFIERS *************/
  private poolData = {
    UserPoolId: environment.userPoolId, // CognitoUserPool
    ClientId: environment.clientId // CognitoUserPoolClient
  };
  private identityPool: string = environment.identityPoolId; // CognitoIdentityPool
  private region: string = environment.region; // Region Matching CognitoUserPool region
  /*********************************************/

  constructor(
  ) {
    AWS.config.update({
      region: this.region,
      credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: ''
      })
    });
    AWSCognito.config.region = this.region;
    AWSCognito.config.update({ accessKeyId: 'null', secretAccessKey: 'null' });
  }

  /**
   * Authticate base on username/email and password
   *
   * @param user
   * @param password
   */
  authenticate(user: string, password: string) {
    const authenticationDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails({
      Username: user,
      Password: password,
    });
    const userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(this.poolData);
    const cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser({
      Username: user,
      Pool: userPool
    });

    return Observable.create((observer) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (sess) {
          observer.next(sess);
          observer.complete();
        },
        onFailure: function (err) {
          observer.error(err)
        }
      })
    }).map((sess) => {
      this.getLoggedUser(sess.getIdToken().getJwtToken())
    });
  }

  /**
   * Kiểm tra token
   * Nếu hợp lệ sẽ lưu token vào local Storge
   * để sử dụng cho các request sau dựa vào Json Web Token(JWT)
   *
   * @param token
   */
  getLoggedUser(token: string): any {
    if (!token || this.jwtHelper.isTokenExpired(token)) {
      consoleLog('Cog Auth: Token expired');
      return null;
    }

    // After authenticate
    // Update AWS token for use in another services
    const cognitoParams = {
      IdentityPoolId: this.identityPool,
      Logins: {}
    };
    cognitoParams.Logins[
      'cognito-idp.' + this.region +
      '.amazonaws.com/' + this.poolData.UserPoolId
    ] = localStorage.getItem('token');
    AWS.config.credentials = new AWS.CognitoIdentityCredentials(cognitoParams);

    // Update user information from the token
    localStorage.setItem('token', token);
    return this.jwtHelper.decodeToken(token);
  }

  logout() {
    localStorage.clear();
  }
}
