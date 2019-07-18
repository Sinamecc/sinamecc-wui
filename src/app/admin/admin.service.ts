import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AuthenticationService } from '@app/core';
import { map } from 'rxjs/operators';
import { Permissions } from './permissions';
import { Groups } from './groups';
import { Observable } from 'rxjs';
import { ReportContext } from '@app/report/report.service';

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

const routes = {
  permissions:() => `/v1/user/permissions/`,
  groups:() => `/v1/user/groups/`,
  submitUser:() =>  `/v1/user/`,
  submitPermissions:(userName:string) => `/v1/user/${userName}/permission/`,
  submitGroups:(userName:string) =>`/v1/user/${userName}/group/`
}

@Injectable()
export class AdminService {


  constructor(private authenticationService: AuthenticationService,
    private httpClient: HttpClient) { }


   permissions(){

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': this.authenticationService.credentials.token
      })
    };
    let asyncResult =  this.httpClient
      .get<Permissions[]>(routes.permissions(), httpOptions) 
      .pipe(
        map((body: any) => {
          return body;
        })
      );

      return asyncResult

  }

  groups(){

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': this.authenticationService.credentials.token
      })
    };
    let asyncResult =  this.httpClient
      .get<Groups[]>(routes.groups(), httpOptions) 
      .pipe(
        map((body: any) => {
          return body;
        })
      );

      return asyncResult

  }

  submitPermissions(context: any): Observable <Response> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': this.authenticationService.credentials.token
      })
    };
    let form = {
      "permissions": context.permissions
    }

    return this.httpClient
        .post(routes.submitPermissions(context.userName), form, httpOptions)
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

  submitDetail(context: any,type:string): Observable <Response> {
    if(type == "permissions"){

      return this.submitPermissions(context)

    }

    return this.submitGroups(context)
  }

  submitGroups(context: any): Observable <Response> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': this.authenticationService.credentials.token
      })
    };
    let form = {
      "groups": context.groups
    }
    return this.httpClient
        .post(routes.submitGroups(context.userName), form, httpOptions)
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

  submitUser(context: any): Observable <Response> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': this.authenticationService.credentials.token
      })
    };

    let formData: FormData = new FormData();
    formData.append('username',context.userName);
    formData.append('password',context.password);
    formData.append('email',context.email);
    formData.append('first_name',context.name);
    formData.append('last_name',context.lastName);
    formData.append('is_staff',context.staff);
    formData.append('is_active',context.active);
    formData.append('is_provider',context.provider);
    formData.append('is_administrador_dcc',context.dccUser);
    formData.append('status', 'created');
    
    return this.httpClient
        .post(routes.submitUser(), formData, httpOptions)
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
