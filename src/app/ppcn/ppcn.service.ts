import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Logger, I18nService, AuthenticationService } from '@app/core';
import { DatePipe } from '@angular/common';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import {Ppcn, GeographicLevel} from '@app/ppcn/ppcn_registry'

const routes = {
  getGeographicLevel: (lang: string) => `/v1/ppcn/geographic/level/${lang}`,
  getRequiredLevel: () => `/v1/ppcn/required/level`
}

export interface Response {
  // Customize received credentials here
  statusCode: number;
  message: string;
  id?: string;

}
@Injectable()
export class PpcnService {

  constructor(private authenticationService: AuthenticationService,
    private httpClient: HttpClient,
    private datePipe: DatePipe) { 

    }

    ppcn(lang: string): Observable < Ppcn[] > {
      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': this.authenticationService.credentials.token
        })
      };
      return this.httpClient
        .get(routes.getGeographicLevel(lang), httpOptions) 
        .pipe(
          map((body: any) => {
            return body;
          })
        );
  
    }
  
    geographicLevel(lang: string): Observable < GeographicLevel[] > {
      const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': this.authenticationService.credentials.token
        })
      };
      return this.httpClient
        .get(routes.getGeographicLevel(lang), httpOptions) 
        .pipe(
          map((body: any) => {
            return body;
          })
        );
  
    }

}
