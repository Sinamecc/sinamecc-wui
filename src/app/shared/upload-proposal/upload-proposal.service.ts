import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient} from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from '@app/core';
import { map, catchError } from 'rxjs/operators';
import { Response } from '@app/shared/response';


@Injectable()
export class UploadProposalService {

  constructor(private authenticationService: AuthenticationService,
    private httpClient: HttpClient) {

  }

  uploadProposal(context: any, entity: any, routeToUpload: string, formData: FormData): Observable <Response> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': this.authenticationService.credentials.token
      })
    };
    // let formData = entity.buildProposalData(context);
    return this.httpClient
    .post(routeToUpload, formData, httpOptions)
    .pipe(
      map((body: any) => {
        const response = {
          statusCode: 200,
          message: 'Form submitted correctly'
        };
        return response;
      }
    )
    );
  }









}
