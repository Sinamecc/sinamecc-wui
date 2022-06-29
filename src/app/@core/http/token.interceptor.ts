import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CredentialsService } from '@app/auth';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private credentialsService: CredentialsService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.credentialsService?.credentials?.token && request.url !== '/api/v1/user/admin') {
      const userToken = this.credentialsService.credentials.token;
      const headers = new HttpHeaders({
        Authorization: `${userToken}`,
        'Accept-Language': 'es', // TODO: define leng selector
      });
      const modifiedReq = request.clone({ headers });
      return next.handle(modifiedReq);
    }
    return next.handle(request);
  }
}
