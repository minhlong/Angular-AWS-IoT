import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { environment } from '../../environments/environment';

declare const AWS: any;
declare const AWSCognito: any;

export interface Callback {
  cognitoCallback(message: string, result: any): void;
  cognitoCallbackWithCreds(message: string, result: any, creds: any, data: any): void;
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
  authenticate(user: string, password: string, callback: Callback) {
    const authenticationDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails({
      Username: user,
      Password: password,
    });
    const userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(this.poolData);
    const cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser({
      Username: user,
      Pool: userPool
    });

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result) {
        callback.cognitoCallback(null, result);
        const cognitoGetUser = userPool.getCurrentUser();
        if (cognitoGetUser != null) {
          cognitoGetUser.getSession(function (err, res) {
            if (res) {
              console.log('Authenticated to Cognito User Pools!');
            }
          });
        }
      },
      onFailure: function (err) {
        callback.cognitoCallback(err, null);
      }
    });
  }
}
