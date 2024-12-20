import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { MccrPoc, VerifyResponse } from '@app/mccr/mccr-poc/mccr-poc';
import { map } from 'rxjs/operators';

const routes = {
  getMccrPoc: (uuid: string, lang: string) => `/v1/ucc/${uuid}/balance`,
  cancelUcc: (uuid: string) => `/v1/ucc/${uuid}/cancel`,
  submitUccBuyerTransfer: () => '/v1/account/buyer/transfer',
  submitUccDeveloperTransfer: () => '/v1/account/developer/transfer',
  submitNewUcc: () => '/v1/ucc',
  submitNewDeveloperAccount: () => '/v1/account/developer',
  submitNewBuyerAccount: () => '/v1/account/buyer',
  verifyUCC: (uuid: string) => `/v1/ucc/${uuid}/verify`,
};

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

@Injectable({
  providedIn: 'root',
})
export class MccrPocService {
  constructor(private httpClient: HttpClient) {}

  private mccr_POCActionSource = new BehaviorSubject(null);
  currentMmcr_POC = this.mccr_POCActionSource.asObservable();

  getMccrPoc(uuid: string, lang: string): Observable<MccrPoc> {
    const httpOptions = {
      headers: new HttpHeaders({}),
      params: {
        remoteUrl: '/carbonmarket',
      },
    };

    return this.httpClient.get(routes.getMccrPoc(uuid, lang), httpOptions).pipe(
      map((body: any) => {
        return body;
      }),
    );
  }

  cancelUcc(uuid: string): Observable<{} | Object> {
    const httpOptions = {
      headers: new HttpHeaders({}),
      params: {
        remoteUrl: '/carbonmarket',
      },
    };
    return this.httpClient.get(routes.cancelUcc(uuid), httpOptions).pipe(
      map((body: any) => {
        const response = {
          statusCode: 200,
          message: 'UCC cancel correctly',
        };
        return response;
      }),
    );
  }

  submitUccBuyerTransfer(context: any): Observable<Response> {
    const httpOptions = {
      headers: new HttpHeaders({}),
      params: {
        remoteUrl: '/carbonmarket',
      },
    };

    const formData: FormData = new FormData();
    formData.append('user_id', context.userId);
    formData.append('ucc_base_code', context.uccBaseCode);
    formData.append('developer_account_number', context.developerAccountNUmber);
    formData.append('buyer_account_number', context.buyerAccountNUmber);
    formData.append('number_ucc_to_transfer', context.numberUccToTransfer);
    formData.append('status', 'created');

    return this.httpClient.post(routes.submitUccBuyerTransfer(), formData, httpOptions).pipe(
      map((body: any) => {
        const response = {
          statusCode: 200,
          message: 'Form submitted correctly',
        };
        return response;
      }),
    );
  }

  submitNewDeveloperAccount(context: any): Observable<Response> {
    const httpOptions = {
      headers: new HttpHeaders({}),
      params: {
        remoteUrl: '/carbonmarket',
      },
    };

    const formData: FormData = new FormData();
    formData.append('user_id', context.user_id);

    return this.httpClient.post(routes.submitNewDeveloperAccount(), formData, httpOptions).pipe(
      map((body: any) => {
        const response = {
          statusCode: 200,
          message: 'Form submitted correctly',
          account_number: body.account_number,
        };
        return response;
      }),
    );
  }

  submitNewBuyerAccount(context: any): Observable<Response> {
    const httpOptions = {
      headers: new HttpHeaders({}),
      params: {
        remoteUrl: '/carbonmarket',
      },
    };

    const formData: FormData = new FormData();
    formData.append('user_id', context.user_id);

    return this.httpClient.post(routes.submitNewBuyerAccount(), formData, httpOptions).pipe(
      map((body: any) => {
        const response = {
          statusCode: 200,
          message: 'Form submitted correctly',
          account_number: body.account_number,
        };
        return response;
      }),
    );
  }

  submitNewUcc(context: any): Observable<Response> {
    const httpOptions = {
      headers: new HttpHeaders({}),
      params: {
        remoteUrl: '/carbonmarket',
      },
    };

    const formData: FormData = new FormData();

    formData.append('user_id', context.userId);
    formData.append('ucc_batch_base', context.uccBatchCode);
    formData.append('ucc_batch_size', context.uccBatchSize);
    formData.append('status', 'created');

    return this.httpClient.post(routes.submitNewUcc(), formData, httpOptions).pipe(
      map((body: any) => {
        const response = {
          statusCode: 200,
          message: 'Form submitted correctly',
        };
        return response;
      }),
    );
  }

  submitUccDeveloperTransfer(context: any): Observable<Response> {
    const httpOptions = {
      headers: new HttpHeaders({}),
      params: {
        remoteUrl: '/carbonmarket',
      },
    };

    const formData: FormData = new FormData();
    formData.append('user_id', context.userId);
    formData.append('ucc_base_code', context.uccBaseCode);
    formData.append('developer_account_number', context.developerAccountNUmber);
    formData.append('status', 'created');

    return this.httpClient.post(routes.submitUccDeveloperTransfer(), formData, httpOptions).pipe(
      map((body: any) => {
        const response = {
          statusCode: 200,
          message: 'Form submitted correctly',
        };
        return response;
      }),
    );
  }

  verifyUCC(uuid: string) {
    const httpOptions = {
      params: {
        remoteUrl: '/carbonmarket',
      },
    };

    return this.httpClient.get(routes.verifyUCC(uuid), httpOptions).pipe(
      map((body: VerifyResponse) => {
        return body;
      }),
    );
  }
}
