import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { CredentialsService } from '@app/auth';
import { ReportDataCatalog } from './interfaces/report-data';
import { ReportDataPayload } from './interfaces/report-data-payload';
import { S3Service, S3File } from '@app/@shared';
import { Report } from './interfaces/report';

export interface Response {
  id?: string;
  // Customize received credentials here
  statusCode: number;
  message: string;
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
  submitReport: () => `/v1/report-data/report/`,
  submitEditReport: (id: string) => `/v1/report-data/report/${id}`,
  submitVersion: (id: number) => `/v1/report_file/${id}`,
  reports: (id: string = '') => `/v1/report-data/report/${id ? id + '/' : id}`,
  versions: (id: number) => `/v1/report_file/${id}/versions`,
  reportDataCatalogs: () => `/v1/report-data/data/`,
  submitReportFile: (id: string) => `/v1/report-data/report/${id}/file/`,
};

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private reportSource = new BehaviorSubject(null);
  currentReport = this.reportSource.asObservable();

  constructor(private httpClient: HttpClient, private credentialsService: CredentialsService, private s3: S3Service) {}

  updateCurrentReport(newReport: ReportDataPayload) {
    this.reportSource.next(newReport);
  }

  submitReportFile(key: string, file: File, id: string) {
    const formData: FormData = new FormData();
    formData.append(key, file);

    return this.httpClient.post(routes.submitReportFile(id), formData, {}).pipe(
      map((body: any) => {
        return body;
      })
    );
  }

  /**
   * Submit Report Forms.
   * @param {ReportContext} context The report form parameters.
   * @return {Observable<Response>} The report response.
   */
  submitReport(context: ReportDataPayload): Observable<Response> {
    // Replace by proper api call, verify params in component

    return this.httpClient.post(routes.submitReport(), context).pipe(
      map((body: any) => {
        const response = {
          id: body.id,
          statusCode: 200,
          message: 'Form submitted correctly',
        };
        return response;
      })
    );
  }

  submitEditReport(context: ReportDataPayload, id: string): Observable<Response> {
    return this.httpClient.put(routes.submitEditReport(id), context).pipe(
      map(() => {
        const response = {
          statusCode: 200,
          message: 'Form submitted correctly',
        };
        return response;
      })
    );
  }

  /**
   * Submit Report Version Forms.
   * @param {ReportContext} context The report version form parameters.
   * @return {Observable<Response>} The report response.
   */
  submitReportVersion(context: ReportContext, id: number): Observable<Response> {
    // Replace by proper api call, verify params in component

    const fileList = context.file.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      const formData: FormData = new FormData();
      formData.append('name', context.name);
      formData.append('file', file, file.name);
      return this.httpClient
        .put(routes.submitVersion(id), formData, {
          headers: {},
          observe: 'response',
        })
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
    return this.httpClient.get(routes.reports(), {}).pipe(
      map((body: any) => {
        return body;
      })
    );
  }

  report(id: string): Observable<Report> {
    return this.httpClient.get(routes.reports(id), {}).pipe(
      map((body: any) => {
        return body;
      })
    );
  }

  versions(id: number): Observable<Version[]> {
    return this.httpClient.get(routes.versions(id), {}).pipe(
      map((body: any) => {
        return body.versions;
      })
    );
  }

  public async downloadResource(filePath: string): Promise<S3File> {
    return this.s3.downloadResource(filePath);
  }

  reportVersionsName(id: number): Observable<string> {
    return this.httpClient.get(routes.versions(id), {}).pipe(
      map((body: any) => {
        return body.name;
      })
    );
  }

  getReportCatalogs() {
    return this.httpClient.get(routes.reportDataCatalogs()).pipe(
      map((body: ReportDataCatalog) => {
        return body;
      })
    );
  }
}
