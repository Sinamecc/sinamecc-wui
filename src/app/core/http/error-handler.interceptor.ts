import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';

import { environment } from '@env/environment';
import { Logger } from '../logger.service';
import { Router } from '@angular/router';

const log = new Logger('ErrorHandlerInterceptor');

/**
 * Adds a default error handler to all requests.
 */
@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {

  constructor(private router: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(error => this.errorHandler(error)));
  }

  // Customize the default error handler here if needed
  private errorHandler(response: HttpEvent<any>): Observable<HttpEvent<any>> {
    if (response instanceof HttpErrorResponse) {
       if(response.status === 401) {
        //this.authenticationService.logout();
        this.router.navigate(['/login'], { replaceUrl: true });
       }
    }
    if (!environment.production) {
      // Do something with the error
      log.error('Request error', response);
    }
    throw response;
  }

}
