import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable()
export class DataInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      map((event) => {
        // Solo procesamos respuestas del tipo HttpResponse
        if (event instanceof HttpResponse) {
          const body = event.body;
          // Si la estructura tiene 'data', devolvemos solo eso
          if (body && body.data !== undefined) {
            return event.clone({ body: body.data });
          }
        }
        return event;
      })
    );
  }
}
