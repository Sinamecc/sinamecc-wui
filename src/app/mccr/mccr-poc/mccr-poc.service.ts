import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse} from '@angular/common/http';

import { DatePipe } from '@angular/common';
import { Logger, I18nService, AuthenticationService } from '@app/core';
import { S3File, S3Service } from '@app/core/s3.service';
import { BehaviorSubject } from 'rxjs';
import { MccrPoc } from '@app/mccr/mccr-poc/mccr-poc';
import { Observable } from 'rxjs/Observable';
import { map, catchError } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';


const routes = {
  getMccrPoc: (uuid: string, lang: string) => `/v1/ucc/${uuid}/balance`
}

export interface Response {
  // Customize received credentials here
  statusCode: number;
  message: string;
  id?: string;

}

export interface ReportContext {
  comment: string;
  file: string | any;
}

@Injectable()
export class MccrPocService {

  constructor(private authenticationService: AuthenticationService,
    private httpClient: HttpClient,
    private datePipe: DatePipe,
    private s3:S3Service){}

    private mccr_POCActionSource = new BehaviorSubject(null);
    currentMmcr_POC = this.mccr_POCActionSource.asObservable();

    
  getMccrPoc(uuid: string, lang: string): Observable <MccrPoc>{

    const httpOptions = {
      headers: new HttpHeaders({
       
      }),
      params: {
        remoteUrl: '/carbonmarket'
      }
    };


    return this.httpClient
      .get(routes.getMccrPoc(uuid, lang), httpOptions) 
      .pipe(
        map((body: any) => {
          console.log('POC', body);
          return body;
        })
      );
      
  }

}
