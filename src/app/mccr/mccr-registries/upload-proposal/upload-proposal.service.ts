import { Injectable } from '@angular/core';
import { CredentialsService } from '@app/auth';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Response } from './response';

@Injectable({
  providedIn: 'root',
})
export class UploadProposalService {
  constructor(private credentialsService: CredentialsService, private httpClient: HttpClient) {}

  uploadProposal(context: any, entity: any, routeToUpload: string, formData: FormData): Observable<Response> {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: this.credentialsService.credentials.token,
      }),
    };
    // let formData = entity.buildProposalData(context);
    return this.httpClient.post(routeToUpload, formData, httpOptions).pipe(
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
