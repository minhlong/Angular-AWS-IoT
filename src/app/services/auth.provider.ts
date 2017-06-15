import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { BaseProvider } from './base.provider';

@Injectable()
export class AuthProvider extends BaseProvider {

  constructor(
    private http: Http,
  ) {
    super();
  }

  /**
   * Kiểm tra thông tin đăng nhập từ Server
   */
  public login(username: string, password: string): Observable<any> {
    return this.http.get('');
  }

  /** Lấy thông tin đăng nhập từ token */
  public getLoggedUser(): Observable<any> {
    return this.http.get('');
  }

  /**
   * Đăng Xuất - Xóa mọi thông tin trên localStorage
   */
  public logout(): void {
  }

  /**
   * Kiểm tra token
   */
  private validateToken(token: string): any {
  }
}
