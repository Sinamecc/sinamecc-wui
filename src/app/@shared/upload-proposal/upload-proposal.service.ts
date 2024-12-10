import { forwardRef, Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Response } from '@shared/response';

@Injectable()
export class UploadProposalService {
  constructor(private httpClient: HttpClient) {}

  uploadProposal(routeToUpload: string, formData: FormData): Observable<Response> {
    return this.httpClient.post(routeToUpload, formData, {}).pipe(
      map((_body: any) => {
        const response = {
          statusCode: 200,
          message: 'Form submitted correctly',
        };
        return response;
      }),
    );
  }
}
