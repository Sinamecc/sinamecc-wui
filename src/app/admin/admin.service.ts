import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { AuthenticationService } from '@app/core';
import { map } from 'rxjs/operators';
import { Permissions } from './permissions';
import { Groups } from './groups';
import { Observable } from 'rxjs/Observable';
import { User } from './users';

export interface Response {
  // Customize received credentials here
  statusCode: number;
  message: string;
  id?: string;
  body?: any;

}

// export interface ReportContext {
//   comment: string;
//   file: string | any;
// }

const routes = {
  permissions: () => `/v1/user/permission/`,
  groups: () => `/v1/user/group/`,
  submitUser: () =>  `/v1/user/`,
  submitPermissions: (userName: string) => `/v1/user/${userName}/permission/`,
  submitGroups: (userName: string) => `/v1/user/${userName}/group/`,
  users: () => `/v1/user/`,
  user: (userName: string) => `/v1/user/${userName}`,
  editUser: (userId: string) => `/v1/user/${userId}`,
  submitImage: () => `/v1/user/1/profile_picture/`
};

@Injectable()
export class AdminService {


  constructor(private authenticationService: AuthenticationService,
    private httpClient: HttpClient) { }


   permissions() {

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': this.authenticationService.credentials.token
      })
    };
    const asyncResult =  this.httpClient
      .get<Permissions[]>(routes.permissions(), httpOptions)
      .pipe(
        map((body: any) => {
          return body;
        })
      );

      return asyncResult;

  }

  groups() {

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': this.authenticationService.credentials.token
      })
    };
    const asyncResult =  this.httpClient
      .get<Groups[]>(routes.groups(), httpOptions)
      .pipe(
        map((body: any) => {
          return body;
        })
      );

      return asyncResult;

  }

  users(): Observable < User[] > {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': this.authenticationService.credentials.token
      })
    };
    return this.httpClient
      .get(routes.users(), httpOptions)
      .pipe(
        map((body: any) => {
          return body;
        })
      );
  }

  user(username: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': this.authenticationService.credentials.token
      })
    };
    return this.httpClient
    .get(routes.user(username), httpOptions)
    .pipe(
      map((body: any) => {
        return body;
      })
    );

  }

  editUser(userId: string, context: any): Observable <Response> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': this.authenticationService.credentials.token
      })
    };

    const formData: FormData = new FormData();
    formData.append('username', context.userName);
    formData.append('email', context.email);
    formData.append('first_name', context.name);
    formData.append('last_name', context.lastName);
    formData.append('is_staff', context.staff);
    formData.append('is_active', context.active);
    formData.append('is_provider', context.provider);
    formData.append('is_administrador_dcc', context.dccUser);
    formData.append('status', 'created');


    return this.httpClient
    .put(routes.editUser(userId), formData , httpOptions)
    .pipe(
      map((body: any) => {
        return body;
      })
    );



  }

  submitPermissions(context: any): Observable <Response> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': this.authenticationService.credentials.token
      })
    };
    const form = {
      'permissions': context.permissions
    };

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

  deletePermissions(context: any, permissions: any): Observable <Response> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': this.authenticationService.credentials.token
      }),
    };
    const form = {
      'permissions': permissions
    };

    return this.httpClient
        .put(routes.submitPermissions(context.userName), form, httpOptions)
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

  submitDetail(context: any, type: string): Observable <Response> {
    if (type === 'permissions') {

      return this.submitPermissions(context);

    }

    return this.submitGroups(context);
  }

  submitGroups(context: any): Observable <Response> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': this.authenticationService.credentials.token
      })
    };
    const form = {
      'groups': context.groups
    };
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

  deleteGroups(context: any, groups: any): Observable <Response> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': this.authenticationService.credentials.token
      }),
    };
    const form = {
      'groups': groups
    };

    return this.httpClient
        .put(routes.submitGroups(context.userName), form, httpOptions)
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

  submitCreatePermissions(context: any): Observable <Response> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': this.authenticationService.credentials.token
      })
    };

    const formData: FormData = new FormData();
    formData.append('name', context.name);
    formData.append('codename', context.codename);
    formData.append('content_type', context.content_type);
    formData.append('status', 'created');

    return this.httpClient
        .post(routes.permissions(), formData, httpOptions)
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

  createUserImage(context: any) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': this.authenticationService.credentials.token
      })
    };

    const formData: FormData = new FormData();
    formData.append('user', context.user);
    formData.append('image', context.image);

    return this.httpClient
        .post(routes.submitImage(), formData, httpOptions)
        .pipe(
          map((body: any) => {
            const response = {
              statusCode: 200,
              message: 'Image submitted correctly',
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

    const formData: FormData = new FormData();
    formData.append('username', context.userName);
    formData.append('password', context.password);
    formData.append('email', context.email);
    formData.append('first_name', context.name);
    formData.append('last_name', context.lastName);
    formData.append('is_staff', context.staff);
    formData.append('is_active', context.active);
    formData.append('is_provider', context.provider);
    formData.append('is_administrador_dcc', context.dccUser);
    formData.append('status', 'created');

    return this.httpClient
        .post(routes.submitUser(), formData, httpOptions)
        .pipe(
          map((body: any) => {
            const response = {
              statusCode: 200,
              message: 'Form submitted correctly',
              body: body
            };
            return response;
          })
        );

  }

}
