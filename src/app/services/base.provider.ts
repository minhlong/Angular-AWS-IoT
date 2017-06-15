/**
 * BaseProvider for another
 */
import { Observable } from 'rxjs/Rx';

export class BaseProvider {
  constructor() { }

  /** Throw error */
  protected handleError(error: any): Observable<any> {
    const errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    return Observable.throw(errMsg);
  }
}
