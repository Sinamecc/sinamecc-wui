import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

export interface Response {
  // Customize received credentials here
  statusCode: number;
  message: string;
}

export interface ReportContext {
  name: string;
  filename: string;
  userId: number;
}


/**
 * Provides a base for reporting workflow.
 */
@Injectable()
export class ReportService {


  constructor() {

  }

  /**
   * Submit Report Forms.
   * @param {ReportContext} context The report form parameters.
   * @return {Observable<Response>} The report response.
   */
  submitReport(context: ReportContext): Observable<Response> {
    // Replace by proper api call, verify params in component

    const response = {statusCode: 200, message: 'Form submitted correctly'};
    return of(response);
  }


}
