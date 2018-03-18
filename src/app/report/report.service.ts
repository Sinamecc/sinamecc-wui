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

export interface Reports {
  reports: Report[];
}

export interface Report {
  name: string;
  created_at: string;
  last_active_version: string;
  versions: Version[];
  report_file_id: number;
}

export interface Version {
  version_name: string;
  file: string;
}

export interface ReportContext {
  name: string;
  file: string|any;
}

const routes = {
  submitReport: () => `/v1/report_file/`,
  reports: () => `/v1/reports/`,
  versions: () => `/v1/report/versions/`
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

    let fileList = context.file.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      let formData:FormData = new FormData();
      formData.append('name', context.name);
      formData.append('file', file, file.name);
      return this.httpClient
      .post(routes.submitReport(), formData, httpOptions) 
      .pipe(
        map((body: any) => {
          console.log(body);
          const response = {statusCode: 200, message: 'Form submitted correctly'};
          return response;
        })
      );
    } else {
      // raise exception
    }
  }

  reports(): Observable<Reports> {
    const r1: Report = {name: 'Titan', 
                        created_at: '2018-03-14 05:19:11.982642+00', 
                        report_file_id: 1,
                        last_active_version: 'v3',
                        versions: [{version_name: 'v1', file: 'report_data/2018/03/13/23/04/49/get_token'},
                                   {version_name: 'v2', file: 'report_data/2018/03/13/23/04/49/get_token'},
                                   {version_name: 'v3', file: 'report_data/2018/03/13/23/04/49/get_token'}]};
    const r2: Report = {name: 'Dodge Ram', 
                        created_at: '2018-03-12 07:19:11.982642+00', 
                        last_active_version: 'v001',
                        report_file_id: 2,
                        versions: [{version_name: 'v001', file: 'report_data/2018/03/13/23/04/49/get_token'}]};
    const r3: Report = {name: 'Tundra', 
                        report_file_id: 3,
                        created_at: '2016-03-12 07:19:11.982642+00', 
                        last_active_version: 'v5',
                        versions: [{version_name: 'v1', file: 'report_data/2018/03/13/23/04/49/get_token'},
                                   {version_name: 'v2', file: 'report_data/2018/03/13/23/04/49/get_token'},
                                   {version_name: 'v3', file: 'report_data/2018/03/13/23/04/49/get_token'},
                                   {version_name: 'v4', file: 'report_data/2018/03/13/23/04/49/get_token'},
                                   {version_name: 'v5', file: 'report_data/2018/03/13/23/04/49/get_token'}]};
    const response: Reports = {reports: [r1, r2, r3]};
    return of(response);
  }


}
