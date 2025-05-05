import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Groups } from '@app/admin/groups';
import { Observable } from 'rxjs';
import { User } from '@app/admin/users';
import { Role } from '@app/admin/roles';
export interface Response {
  // Customize received credentials here
  statusCode: number;
  message: string;
  id?: string;
  body?: any;
}

const routes = {
  permissions: () => `/v1/user/permission/`,
  groups: () => `/v1/user/group/`,
  roles: () => `/v1/users/roles`,
  submitUser: () => `/v1/users`,
  submitPermissions: (userName: string) => `/v1/user/${userName}/permission/`,
  submitGroups: (userName: string) => `/v1/user/${userName}/group/`,
  users: () => `/v1/users`,
  user: (userName: string) => `/v1/user/${userName}`,
  editUser: (userId: string) => `/v1/users/${userId}`,
  submitImage: () => `/v1/user/1/profile_picture/`,
  assignRoles: (userId: string) => `/v1/users/${userId}/roles`,
};

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private httpClient: HttpClient) {}

  permissions() {
    const asyncResult = this.httpClient.get<Permissions[]>(routes.permissions(), {}).pipe(
      map((body: any) => {
        return body;
      }),
    );
    return asyncResult;
  }

  groups() {
    const asyncResult = this.httpClient.get<Groups[]>(routes.groups(), {}).pipe(
      map((body: any) => {
        return body;
      }),
    );
    return asyncResult;
  }

  users(): Observable<User[]> {
    return this.httpClient.get(routes.users(), {}).pipe(
      map((body: any) => {
        return body;
      }),
    );
  }

  roles(): Observable<Role[]> {
    return this.httpClient.get(routes.roles(), {}).pipe(
      map((body: any) => {
        return body;
      }),
    );
  }

  user(username: string) {
    return this.httpClient.get(routes.user(username), {}).pipe(
      map((body: any) => {
        return body;
      }),
    );
  }

  editUser(userId: string, context: any): Observable<Response> {
    const formData: FormData = new FormData();
    formData.append('username', context.userName);
    formData.append('email', context.email);
    formData.append('first_name', context.name);
    formData.append('last_name', context.lastName);
    formData.append('status', 'created');

    return this.httpClient.put(routes.editUser(userId), formData, {}).pipe(
      map((body: any) => {
        return body;
      }),
    );
  }

  submitPermissions(context: any): Observable<Response> {
    const form = {
      permissions: context.permissions,
    };

    return this.httpClient.post(routes.submitPermissions(context.userName), form, {}).pipe(
      map((body: any) => {
        const response = {
          statusCode: 200,
          message: 'Form submitted correctly',
        };
        return response;
      }),
    );
  }

  deletePermissions(context: any, permissions: any): Observable<Response> {
    const form = {
      permissions: permissions,
    };

    return this.httpClient.put(routes.submitPermissions(context.userName), form, {}).pipe(
      map((body: any) => {
        const response = {
          statusCode: 200,
          message: 'Form submitted correctly',
        };
        return response;
      }),
    );
  }

  submitDetail(context: any, type: string): Observable<Response> {
    if (type === 'permissions') {
      return this.submitPermissions(context);
    }

    return this.submitGroups(context);
  }

  submitGroups(context: any): Observable<Response> {
    const form = {
      groups: context.groups,
    };
    return this.httpClient.post(routes.submitGroups(context.userName), form, {}).pipe(
      map((body: any) => {
        const response = {
          statusCode: 200,
          message: 'Form submitted correctly',
        };
        return response;
      }),
    );
  }

  deleteGroups(context: any, groups: any): Observable<Response> {
    const form = {
      groups: groups,
    };
    return this.httpClient.put(routes.submitGroups(context.userName), form, {}).pipe(
      map((body: any) => {
        const response = {
          statusCode: 200,
          message: 'Form submitted correctly',
        };
        return response;
      }),
    );
  }

  assignRoles(context: any) {
    const userId = context.userId;
    const formData: FormData = new FormData();
    const form = {
      roles: context.roles,
    };
    // formData.append('roles', JSON.stringify(context.roles));
    return this.httpClient.post(routes.assignRoles(userId), form, {});
  }

  submitCreatePermissions(context: any): Observable<Response> {
    const formData: FormData = new FormData();
    formData.append('name', context.name);
    formData.append('codename', context.codename);
    formData.append('content_type', context.content_type);
    formData.append('status', 'created');

    return this.httpClient.post(routes.permissions(), formData, {}).pipe(
      map((body: any) => {
        const response = {
          statusCode: 200,
          message: 'Form submitted correctly',
        };
        return response;
      }),
    );
  }

  createUserImage(context: any) {
    const formData: FormData = new FormData();
    formData.append('user', context.user);
    formData.append('image', context.image);

    return this.httpClient.post(routes.submitImage(), formData, {}).pipe(
      map((body: any) => {
        const response = {
          statusCode: 200,
          message: 'Image submitted correctly',
        };
        return response;
      }),
    );
  }

  submitUser(context: any): Observable<Response> {
    const formData: FormData = new FormData();
    formData.append('username', context.userName);
    formData.append('password', context.password);
    formData.append('email', context.email);
    formData.append('first_name', context.name);
    formData.append('last_name', context.lastName);
    formData.append('status', 'created');

    return this.httpClient.post(routes.users(), formData, {}).pipe(
      map((body: any) => {
        const response = {
          statusCode: 200,
          message: 'Form submitted correctly',
          body: body,
        };
        return response;
      }),
    );
  }

  removeUser(id: string) {
    return this.httpClient.delete(routes.editUser(id), {}).pipe(
      map((body: any) => {
        const response = {
          statusCode: 200,
          id: body.id,
        };
        return response;
      }),
    );
  }
}
