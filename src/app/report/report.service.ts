import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Logger, I18nService, AuthenticationService } from '@app/core';

export interface Response {
  // Customize received credentials here
  statusCode: number;
  message: string;
}

export interface ReportContext {
  name: string;
  reportFile: string|any;
}

const routes = {
  reportFile: () => `/v1/report_file/`
};


/**
 * Provides a base for reporting workflow.
 */
@Injectable()
export class ReportService {


  constructor(private authenticationService: AuthenticationService,
              private httpClient: HttpClient) {

  }

  /**
   * Submit Report Forms.
   * @param {ReportContext} context The report form parameters.
   * @return {Observable<Response>} The report response.
   */
  submitReport(context: ReportContext): Observable<Response> {
    // Replace by proper api call, verify params in component
    console.log(context);
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': this.authenticationService.credentials.token
      })
    };
    return this.httpClient
    .post(routes.reportFile(), context, httpOptions) 
    .pipe(
      map((body: any) => {
        console.log(body);
        const response = {statusCode: 200, message: 'Form submitted correctly'};
        return response;
      })
    );
    // const response = {statusCode: 200, message: 'Form submitted correctly'};
    // return of(response);
  }


}
