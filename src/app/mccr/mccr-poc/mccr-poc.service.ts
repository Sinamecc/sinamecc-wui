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
  getMccrPoc: (uuid: string, lang: string) => `/v1/ucc/${uuid}/balance`,
  cancelUcc:(uuid: string) => `/v1/ucc/${uuid}/cancel`,
  submitUccBuyerTransfer:() => '/v1/account/buyer/transfer',
  submitUccDeveloperTransfer:() => '/v1/account/developer/transfer',
  submitNewUcc:() => '/v1/ucc'
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

  cancelUcc(uuid: string): Observable <{} | Object> {
    const httpOptions = {
      headers: new HttpHeaders({
       
      }),
      params: {
        remoteUrl: '/carbonmarket'
      }
    };
    return this.httpClient
      .get(routes.cancelUcc(uuid), httpOptions) 
      .pipe(
        map((body: any) => {
          const response = {
            statusCode: 200,
            message: 'UCC cancel correctly'
          };
          return response;
        })
      );

  }


  submitUccBuyerTransfer(context: any): Observable <Response> {
    const httpOptions = {
      headers: new HttpHeaders({
       
      }),
      params: {
        remoteUrl: '/carbonmarket'
      }
    }; 

    let formData: FormData = new FormData();
    formData.append('user_id',String(1));
    formData.append('ucc_base_code',context.uccBaseCode);
    formData.append('developer_account_number',context.developerAccountNUmber);
    formData.append('buyer_account_number' ,context.buyerAccountNUmber);
    formData.append('number_ucc_to_transfer',context.numberUccToTransfer);
    formData.append('status', 'created');

      return this.httpClient
      .post(routes.submitUccBuyerTransfer(),formData,httpOptions)
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

  submitNewUcc(context: any): Observable <Response> {
    const httpOptions = {
      headers: new HttpHeaders({
       
      }),
      params: {
        remoteUrl: '/carbonmarket'
      }
    }; 

    let formData: FormData = new FormData();

    console.log("holaaaaaaaaaaaaaaa");
    console.log(formData);

    formData.append('user_id',String(1));
    formData.append('ucc_batch_base',context.uccBatchCode);
    formData.append('ucc_batch_size',context.uccBatchSize);
    formData.append('status', 'created');

    console.log("holaaaaaaaaaaaaaaa");
    console.log(formData);
    

    return this.httpClient
        .post(routes.submitNewUcc(), formData, httpOptions)
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

  submitUccDeveloperTransfer(context: any): Observable <Response> {
    const httpOptions = {
      headers: new HttpHeaders({
       
      }),
      params: {
        remoteUrl: '/carbonmarket'
      }
    }; 


    let formData: FormData = new FormData();
    formData.append('user_id',String(1));
    formData.append('ucc_base_code',context.uccBaseCode);
    formData.append('developer_account_number',context.developerAccountNUmber);
    formData.append('status', 'created');

    return this.httpClient
        .post(routes.submitUccDeveloperTransfer(), formData, httpOptions)
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

}
