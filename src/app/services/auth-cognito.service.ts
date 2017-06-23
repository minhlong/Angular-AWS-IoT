import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { JwtHelper } from 'angular2-jwt';
import { consoleLog } from '../app.helpers';
import { environment } from '../../environments/environment.prod';

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
  private policyName = environment.ioTPolicyName;
  private principal = environment.principalId;
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
        },
        newPasswordRequired: function (userAttributes, requiredAttributes) {
          // User was signed up by an admin and must provide new
          // password and required attributes, if any, to complete
          // authentication.

          // userAttributes: object, which is the user's current profile. It will list all attributes that are associated with the user.
          // Required attributes according to schema, which don’t have any values yet, will have blank values.
          // requiredAttributes: list of attributes that must be set by the user along with new password to complete the sign-in.


          // Get these details and call
          // newPassword: password that user has given
          // attributesData: object with key as attribute name and value that the user has given.
          cognitoUser.completeNewPasswordChallenge('123456789', null, this)
        }
      })
    }).map((sess) => {
      this.getLoggedUser(sess.getIdToken().getJwtToken(), false)
    });
  }

  /**
   * Kiểm tra token
   * Nếu hợp lệ sẽ lưu token vào local Storge
   * để sử dụng cho các request sau dựa vào Json Web Token(JWT)
   *
   * @param token
   */
  getLoggedUser(token: string, bUpdateAWS: boolean = true): any {
    if (!token || this.jwtHelper.isTokenExpired(token)) {
      consoleLog('Cog Auth: Token expired');
      return null;
    }

    if (bUpdateAWS) {
      this.updateAWSCredential()
    }

    // Update user information from the token
    localStorage.setItem('token', token);
    return this.jwtHelper.decodeToken(token);
  }

  // Update AWS token for use in another services for each refresh
  private updateAWSCredential() {
    const cognitoParams = {
      IdentityPoolId: this.identityPool,
      Logins: {}
    };
    cognitoParams.Logins[
      'cognito-idp.' + this.region +
      '.amazonaws.com/' + this.poolData.UserPoolId
    ] = localStorage.getItem('token');
    AWS.config.credentials = new AWS.CognitoIdentityCredentials(cognitoParams);

    // IoT Attaches the specified policy to the specified principal
    // Ref https://stackoverflow.com/a/41449362
    if (this.principal && this.principal) {
      AWS.config.credentials.get((_err) => {
        if (_err) {
          consoleLog('IOT get credentials Err!');
          return null
        }

        const params = {
          policyName: this.policyName,
          principal: this.principal
        };
        const _iot = new AWS.Iot();
        _iot.attachPrincipalPolicy(params, function (err, data) {
          if (err) {
            consoleLog('IOT attach pricipal policy ERR!');
          }
        });
      })
    }
  }

  logout() {
    localStorage.clear();
  }
}
