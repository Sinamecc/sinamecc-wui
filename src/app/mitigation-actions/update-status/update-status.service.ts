import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { CredentialsService } from '@app/auth';

export interface Response {
  // Customize received credentials here
  statusCode: number;
  message: string;
  id?: string;
}
@Injectable()
export class UpdateStatusService {
  constructor(private credentialsService: CredentialsService, private httpClient: HttpClient) {}

  updateStatus(context: any, entity: any, routeToUpload: string, formData: FormData): Observable<Response> {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: this.credentialsService.credentials.token,
      }),
    };
    // let formData = entity.buildProposalData(context);
    return this.httpClient.patch(routeToUpload, formData, httpOptions).pipe(
      map((body: any) => {
        const response = {
          statusCode: 200,
          message: 'Form submitted correctly',
        };
        return response;
      })
    );
  }
}
