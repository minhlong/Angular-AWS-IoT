import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import * as moment from 'moment';
import { Observable } from 'rxjs/Rx';
import { consoleLog } from '../app.helpers';

declare const AWS: any;

@Injectable()
export class MQTTService {

  constructor(
  ) {
  }

  private sign(key, msg) {
    const hash = CryptoJS.HmacSHA256(msg, key);
    return hash.toString(CryptoJS.enc.Hex);
  };

  private sha256(msg) {
    const hash = CryptoJS.SHA256(msg);
    return hash.toString(CryptoJS.enc.Hex);
  };

  private getSignatureKey(key, dateStamp, regionName, serviceName) {
    const kDate = CryptoJS.HmacSHA256(dateStamp, 'AWS4' + key);
    const kRegion = CryptoJS.HmacSHA256(regionName, kDate);
    const kService = CryptoJS.HmacSHA256(serviceName, kRegion);
    const kSigning = CryptoJS.HmacSHA256('aws4_request', kService);
    return kSigning;
  };

  private getSignedUrl(protocol, host, uri, service, region, accessKey, secretKey, sessionToken) {
    const time = moment().utc();
    const dateStamp = time.format('YYYYMMDD');
    const amzdate = dateStamp + 'T' + time.format('HHmmss') + 'Z';
    const algorithm = 'AWS4-HMAC-SHA256';
    const method = 'GET';

    const credentialScope = dateStamp + '/' + region + '/' + service + '/' + 'aws4_request';
    let canonicalQuerystring = 'X-Amz-Algorithm=AWS4-HMAC-SHA256';
    canonicalQuerystring += '&X-Amz-Credential=' + encodeURIComponent(accessKey + '/' + credentialScope);
    canonicalQuerystring += '&X-Amz-Date=' + amzdate;
    canonicalQuerystring += '&X-Amz-SignedHeaders=host';

    const canonicalHeaders = 'host:' + host + '\n';
    const payloadHash = this.sha256('');
    const canonicalRequest = method + '\n' + uri + '\n' + canonicalQuerystring + '\n' + canonicalHeaders + '\nhost\n' + payloadHash;

    const stringToSign = algorithm + '\n' + amzdate + '\n' + credentialScope + '\n' + this.sha256(canonicalRequest);
    const signingKey = this.getSignatureKey(secretKey, dateStamp, region, service);
    const signature = this.sign(signingKey, stringToSign);

    canonicalQuerystring += '&X-Amz-Signature=' + signature;
    if (sessionToken) {
      canonicalQuerystring += '&X-Amz-Security-Token=' + encodeURIComponent(sessionToken);
    }

    const requestUrl = protocol + '://' + host + uri + '?' + canonicalQuerystring;
    return requestUrl;
  }

  generateURL(): Observable<any> {
    const _observable = Observable.bindCallback(AWS.config.credentials.get);
    return _observable.call(AWS.config.credentials)
      .map((err) => {
        if (err) {
          consoleLog('GenerateURL Err: ' + err);
          return null
        }

        return this.getSignedUrl(
          'wss',
          'data.iot.us-east-1.amazonaws.com',
          '/mqtt',
          'iotdevicegateway',
          'us-east-1',
          AWS.config.credentials.accessKeyId,
          AWS.config.credentials.secretAccessKey,
          AWS.config.credentials.sessionToken
        )
      });
  }
}
