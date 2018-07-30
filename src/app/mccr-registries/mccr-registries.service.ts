import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Logger, I18nService, AuthenticationService } from '@app/core';
import { MccrRegistry } from './mccr-registry';
import { MitigationActionNewFormData } from '@app/mitigation-actions/mitigation-action-new-form-data';
import { DatePipe } from '@angular/common';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { MitigationAction } from '@app/mitigation-actions/mitigation-action';
import { S3Service, S3File } from '@app/core/s3.service';

const routes = {
  seededFormData: () => `/v1/mccr/registries`,
  submitNewMccrRegistry: () => `/v1/mccr/`,
  submitUpdateMccrRegistry: (uuid:string) => `/v1/mccr/${uuid}`,
  mccrRegistries: () => `/v1/mccr/`,
  deleteMccrRegistry: (uuid: string) => `/v1/mccr/${uuid}`,
  getMccrRegistry: (uuid: string) => `/v1/mccr/${uuid}`

};


export interface Response {
  // Customize received credentials here
  statusCode: number;
  message: string;

}
@Injectable()
export class MccrRegistriesService {

  constructor(private authenticationService: AuthenticationService,
    private httpClient: HttpClient,
    private datePipe: DatePipe,
    private s3:S3Service) {

  }

  submitMccrRegistryNewForm(context: any): Observable <Response> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': this.authenticationService.credentials.token
      })
    };

    let fileList = context.files;
    let formData: FormData = new FormData();
    formData.append('mitigation', context.mitigationActionCtrl);
    formData.append('user', String(this.authenticationService.credentials.id));
    formData.append('user_type', String(1));
    formData.append('status', 'created');
    if (fileList.length > 0) {
      for (let file of fileList) {
        let fileToUpload = file.file.files[0];
        formData.append('files[]', fileToUpload, fileToUpload.name);
      }  
      return this.httpClient
        .post(routes.submitNewMccrRegistry(), formData, httpOptions)
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

  submitMitigationActionUpdateForm(context: any, uuid: string): Observable <Response> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': this.authenticationService.credentials.token
      })
    };
    
    context['user'] = String(this.authenticationService.credentials.id);
    context['user_type'] = String(1);
    console.log(context);
    /*let formData: FormData = new FormData();
    formData.append('mitigation', context.mitigationActionCtrl);
    formData.append('user', String(this.authenticationService.credentials.id));
    formData.append('user_type', String(1));
    formData.append('status', 'updated'); */
      return this.httpClient
        .put(routes.submitUpdateMccrRegistry(uuid), context, httpOptions)
        .pipe(
          map((body: any) => {
            const response = {
              statusCode: 200,
              message: 'Form submitted correctly'
            };
            return response;
          })
        );
  }

  

  newMccrRegistryFormData(): Observable <MitigationAction[] > {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': this.authenticationService.credentials.token
      })
    };
    return this.httpClient
    .get(routes.seededFormData(), httpOptions) 
    .pipe(
      map((body: any) => {
        return body;
      })
    );

  }

  mccrRegistries(): Observable < MccrRegistry[] > {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': this.authenticationService.credentials.token
      })
    };
    
    return this.httpClient
      .get(routes.mccrRegistries(), httpOptions) 
      .pipe(
        map((body: any) => {
          return body;
        })
      );
  }

  getMccrRegistry(uuid: string): Observable <MccrRegistry> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': this.authenticationService.credentials.token
      })
    };


    return this.httpClient
      .get(routes.getMccrRegistry(uuid), httpOptions) 
      .pipe(
        map((body: any) => {
          console.log('SPECIFIC MCCR REGISTRY', body);
          return body;
        })
      );
  }

  deleteMccrRegistry(uuid: string): Observable <{} | Object> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': this.authenticationService.credentials.token
      })
    };
    const url = routes.deleteMccrRegistry(uuid);
    // routes.deleteMitigationAction(uuid)
    return this.httpClient
      .delete(url, httpOptions) 
      .pipe(
        map((body: any) => {
          const response = {
            statusCode: 200,
            message: 'Mitigation Action deleted correctly'
          };
          return response;
        })
      );

  }

  

  public async downloadResource(filePath: string): Promise<S3File> {
    return this.s3.downloadResource(filePath);
  }
  

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an ErrorObservable with a user-facing error message
    return new ErrorObservable(
      'Something bad happened; please try again later.');
  };
}
