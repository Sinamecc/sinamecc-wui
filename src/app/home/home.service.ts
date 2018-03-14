import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { map, catchError } from 'rxjs/operators';

const routes = {
  healthstatus: () => `/v1/health`
};

@Injectable()
export class HomeService {

  constructor(private httpClient: HttpClient) { }

  getHealthStatus(): Observable<string> {

    return of('Dummy backend');
    /* return this.httpClient
      .cache()
      .get(routes.healthstatus())
      .pipe(
        map((body: any) => {
          return body.message;
        }),
        catchError(() => of('Error, could not ping backend :-('))
      ); */
  }

}
