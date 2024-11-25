import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

export interface Response {
  // Customize received credentials here
  statusCode: number;
  message: string;
  id?: string;
}
@Injectable()
export class UpdateStatusService {
  constructor(private httpClient: HttpClient) {}

  updateStatus(context: any, routeToUpload: string): Observable<Response> {
    const form = {
      fsm_state: context.fsm_state,
      comments: context.comments,
    };

    // let formData = entity.buildProposalData(context);
    return this.httpClient.patch(routeToUpload, form, {}).pipe(
      map((body: any) => {
        const response = {
          statusCode: 200,
          message: 'Form submitted correctly',
        };
        return response;
      }),
    );
  }
}
