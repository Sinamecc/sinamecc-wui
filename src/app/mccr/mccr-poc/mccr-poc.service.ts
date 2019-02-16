import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse} from '@angular/common/http';

import { DatePipe } from '@angular/common';
import { Logger, I18nService, AuthenticationService } from '@app/core';
import { S3File, S3Service } from '@app/core/s3.service';
import { BehaviorSubject } from 'rxjs';
import { Mccr_POC } from '@app/mccr/mccr-poc/Mccr_POC';
import { Observable } from 'rxjs/Observable';
import { map, catchError } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';


const routes = {
  getMccr_POC: (uuid: string, lang: string) => `/v1/ucc/${uuid}/balance`
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

    
  getMccr_POC(uuid: string, lang: string): Observable <Mccr_POC>{

    const httpOptions = {
      headers: new HttpHeaders({
       
      })
    };

    return this.httpClient
      .get(routes.getMccr_POC(uuid, lang), httpOptions) 
      .pipe(
        map((body: any) => {
          console.log('MA', body);
          return body;
        })
      );
      
  }

}
