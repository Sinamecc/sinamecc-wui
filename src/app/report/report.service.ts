import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { S3File, S3Service } from '@app/s3.service';

import { CredentialsService } from '@app/auth';

export interface Response {
  // Customize received credentials here
  statusCode: number;
  message: string;
}
export interface Report {
  name: string;
  created: string;
  updated: string;
}

export interface Version {
  version: string;
  file: string;
}
export interface ReportFileDetailed {
  name: string;
  versions: Version[];
}

export interface ReportContext {
  name: string;
  file: string | any;
}

const routes = {
  submitReport: () => `/v1/report_file/`,
  submitVersion: (id: number) => `/v1/report_file/${id}`,
  reports: () => `/v1/report_file/`,
  versions: (id: number) => `/v1/report_file/${id}/versions`,
};

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  constructor(private httpClient: HttpClient, private credentialsService: CredentialsService, private s3: S3Service) {}

  /**
   * Submit Report Forms.
   * @param {ReportContext} context The report form parameters.
   * @return {Observable<Response>} The report response.
   */
  submitReport(context: ReportContext): Observable<Response> {
    // Replace by proper api call, verify params in component
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: this.credentialsService.credentials.token,
      }),
    };

    const fileList = context.file.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      const formData: FormData = new FormData();

      formData.append('name', context.name);
      formData.append('file', file, file.name);

      const metadata = [];
      for (const element in context) {
        if (element !== 'file' && context[element] !== '') {
          const value = { name: element, value: context[element] };
          metadata.push(value);
        }
      }
      formData.append('metadata', JSON.stringify(metadata));

      return this.httpClient.post(routes.submitReport(), formData, httpOptions).pipe(
        map((body: any) => {
          const response = {
            statusCode: 200,
            message: 'Form submitted correctly',
          };
          return response;
        })
      );
    } else {
      // raise exception
    }
  }

  /**
   * Submit Report Version Forms.
   * @param {ReportContext} context The report version form parameters.
   * @return {Observable<Response>} The report response.
   */
  submitReportVersion(context: ReportContext, id: number): Observable<Response> {
    // Replace by proper api call, verify params in component
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: this.credentialsService.credentials.token,
      }),
    };

    const fileList = context.file.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      const formData: FormData = new FormData();
      formData.append('name', context.name);
      formData.append('file', file, file.name);
      return this.httpClient
        .put(routes.submitVersion(id), formData, { headers: httpOptions.headers, observe: 'response' })
        .pipe(
          map((body: any) => {
            const response = {
              statusCode: 200,
              message: 'Form submitted correctly',
            };
            return response;
          })
        );
    } else {
      // raise exception
    }
  }

  reports(): Observable<Report[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: this.credentialsService.credentials.token,
      }),
    };
    return this.httpClient.get(routes.reports(), httpOptions).pipe(
      map((body: any) => {
        return body;
      })
    );
  }

  versions(id: number): Observable<Version[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: this.credentialsService.credentials.token,
      }),
    };
    return this.httpClient.get(routes.versions(id), httpOptions).pipe(
      map((body: any) => {
        return body.versions;
      })
    );
  }

  public async downloadResource(filePath: string): Promise<S3File> {
    return this.s3.downloadResource(filePath);
  }

  reportVersionsName(id: number): Observable<string> {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: this.credentialsService.credentials.token,
      }),
    };
    return this.httpClient.get(routes.versions(id), httpOptions).pipe(
      map((body: any) => {
        return body.name;
      })
    );
  }
}
