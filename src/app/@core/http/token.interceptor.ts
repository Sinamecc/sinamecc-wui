import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CredentialsService } from '@app/auth';
import { I18nService } from '@app/i18n';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private credentialsService: CredentialsService, private i18nService: I18nService,) {}

  get currentLanguage(): string {
    return this.i18nService.language;
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.credentialsService?.credentials?.token && request.url !== '/api/v1/user/admin') {
      const userToken = this.credentialsService.credentials.token;
      const headers = new HttpHeaders({
        Authorization: `${userToken}`,
        'Accept-Language': this.currentLanguage,
      });
      const modifiedReq = request.clone({ headers });
      return next.handle(modifiedReq);
    }
    return next.handle(request);
  }
}
