import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { HttpClient} from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Logger, I18nService, AuthenticationService } from '@app/core';
import { S3File, S3Service } from '@app/core/s3.service';


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

export interface Version{
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
  versions: (id: number) => `/v1/report_file/${id}/versions`
};


/**
 * Provides a base for reporting workflow.
 */
@Injectable()
export class ReportService {


  constructor(private authenticationService: AuthenticationService,
    private httpClient: HttpClient,
    private s3:S3Service) {

  }

  /**
   * Submit Report Forms.
   * @param {ReportContext} context The report form parameters.
   * @return {Observable<Response>} The report response.
   */
  submitReport(context: ReportContext): Observable < Response > {
    // Replace by proper api call, verify params in component
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': this.authenticationService.credentials.token
      })
    };


    let fileList = context.file.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      let formData: FormData = new FormData();

      formData.append('name', context.name);
      formData.append('file', file, file.name);

      const metadata = []
      for(let element in context){

        if(element != "file" && context[element] != ''){
          let value =  {"name":element,"value":context[element]}
          metadata.push(value) 
        }
        
      }
      formData.append('metadata', JSON.stringify(metadata)); 

      return this.httpClient
        .post(routes.submitReport(), formData, httpOptions)
        .pipe(
          map((body: any) => {
            const response = {
              statusCode: 200,
              message: 'Form submitted correctly'
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
  submitReportVersion(context: ReportContext, id:number): Observable < Response > {
    // Replace by proper api call, verify params in component
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': this.authenticationService.credentials.token
      })
    };

    let fileList = context.file.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      let formData: FormData = new FormData();
      formData.append('name', context.name);
      formData.append('file', file, file.name);
      return this.httpClient
        .put(routes.submitVersion(id), formData, {headers: httpOptions.headers, observe: 'response'})
        .pipe(
          map((body: any) => {
            const response = {
              statusCode: 200,
              message: 'Form submitted correctly'
            };
            return response;
          })
        );
    } else {
      // raise exception
    }
  }

  reports(): Observable < Report[] > {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': this.authenticationService.credentials.token
      })
    };
    return this.httpClient
      .get(routes.reports(), httpOptions) 
      .pipe(
        map((body: any) => {
          return body;
        })
      );
  }

  versions(id:number): Observable<Version[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': this.authenticationService.credentials.token
      })
    };
    return this.httpClient
      .get(routes.versions(id), httpOptions) 
      .pipe(
        map((body: any) => {
          return body.versions;
        })
      );
  }


public async downloadResource(filePath: string): Promise<S3File> {
  return this.s3.downloadResource(filePath);
}

  reportVersionsName(id:number): Observable<string> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': this.authenticationService.credentials.token
      })
    };
    return this.httpClient
      .get(routes.versions(id), httpOptions) 
      .pipe(
        map((body: any) => {
          return body.name;
        })
      );
  }


}
