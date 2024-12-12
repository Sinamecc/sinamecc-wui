import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { map, flatMap } from 'rxjs/operators';

import { Credentials, CredentialsService } from './credentials.service';

export interface LoginContext {
  username: string;
  password: string;
  remember?: boolean;
}

const routes = {
  login: () => `/v1/token/`,
  userData: (username: string) => `/v1/user/${username}`,
  emailResetPassword: () => `/v1/user/change_password/`,
  changePassword: (token: string, code: string) => `/v1/user/change_password/${code}/${token}`,
};

/**
 * Provides a base for authentication workflow.
 * The login/logout methods should be replaced with proper implementation.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(
    private credentialsService: CredentialsService,
    private httpClient: HttpClient,
  ) {}

  /**
   * Authenticates the user.
   * @param context The login parameters.
   * @return The user credentials.
   */
  login(context: LoginContext): Observable<Credentials> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return this.httpClient.post(routes.login(), context, httpOptions).pipe(
      flatMap((body: any) => {
        const innerHttpOptions = {
          headers: new HttpHeaders({
            Authorization: 'JWT ' + body.token,
          }),
        };
        return this.httpClient.get(routes.userData(context.username), innerHttpOptions).pipe(
          map((req: any) => {
            const data = {
              fullName: req.first_name + ' ' + req.last_name,
              username: req.username,
              token: 'JWT ' + body.token,
              id: req.id,
              email: req.email,
              groups: req.groups,
              permissions: req.available_apps,
              userPhoto: req.profile_picture,
            };
            this.credentialsService.setCredentials(data, context.remember);
            return data;
          }),
        );
      }),
    );
  }

  /**
   * Logs out the user and clear credentials.
   * @return True if the user was logged out successfully.
   */
  logout(): Observable<boolean> {
    // Customize credentials invalidation here
    this.credentialsService.setCredentials();
    return of(true);
  }

  sendEmailRestarPassword(email: string) {
    const body = {
      email: email,
    };
    return this.httpClient.post(routes.emailResetPassword(), body).pipe(
      map((response: any) => {
        return response;
      }),
    );
  }

  restorePassword(context: any) {
    const body = {
      password: context.password,
    };
    return this.httpClient.put(routes.changePassword(context.token, context.code), body);
  }

  getUserPhoto(photoUrl: string) {
    return this.httpClient.get(photoUrl, { responseType: 'blob' }).pipe(
      map((res: any) => {
        return res;
      }),
    );
  }
}
