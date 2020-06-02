import { Injectable, OnChanges, group } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { map, catchError, flatMap } from 'rxjs/operators';
import { viewClassName, createAotCompiler } from '@angular/compiler';
import { Permissions } from '../permissions';


export interface Credentials {
  // Customize received credentials here
  id: number;
  email: string;
  username: string;
  fullName: string;
  token: string;
  groups: object;
  permissions: Permissions;
  is_administrador_dcc: boolean;
  userPhoto: any;

}

export interface LoginContext {
  username: string;
  password: string;
  remember?: boolean;
  groups: object;
}



const routes = {
  login: () => `/v1/token/`,
  userData: (username: string) => `/v1/user/${username}`
};

const credentialsKey = 'credentials';

/**
 * Provides a base for authentication workflow.
 * The Credentials interface as well as login/logout methods should be replaced with proper implementation.
 */
@Injectable()
export class AuthenticationService {

  private _credentials: Credentials | null;

  constructor(private httpClient: HttpClient) {
    const savedCredentials = sessionStorage.getItem(credentialsKey) || localStorage.getItem(credentialsKey);
    if (savedCredentials) {
      this._credentials = JSON.parse(savedCredentials);
    }

  }

  /**
   * Authenticates the user.
   * @param {LoginContext} context The login parameters.
   * @return {Observable<Credentials>} The user credentials.
   */
  login(context: LoginContext): Observable<Credentials> {
    // Replace by proper authentication call
    /* const data = {
      username: context.username,
      token: '123456'
    };

    return of(data); */
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
       // 'Authorization': 'my-auth-token'
      })
    };

     return this.httpClient
      .post(routes.login(), context, httpOptions)
      .pipe(
        flatMap((body: any) => {
          const innerHttpOptions = {
            headers: new HttpHeaders({
              'Authorization': 'JWT ' + body.token
            })
          };
          return this.httpClient.get(routes.userData(context.username), innerHttpOptions).pipe(map((req: any) => {

            const data = {
              fullName: req.first_name + ' ' + req.last_name,
              username: req.username,
              token: 'JWT ' + body.token,
              id: req.id,
              email: req.email,
              groups: req.groups,
              permissions: req.available_apps,
              is_administrador_dcc: req.is_administrador_dcc,
              userPhoto: req.profile_picture,
            };
            this.setCredentials(data, context.remember);
            return data;
          }));
        })
      );
  }


  getUserPhoto(photoUrl: string) {
    return this.httpClient.get(photoUrl, {responseType: 'blob'}).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  /**
   * Logs out the user and clear credentials.
   * @return {Observable<boolean>} True if the user was logged out successfully.
   */
  logout(): Observable<boolean> {
    // Customize credentials invalidation here
    this.setCredentials();
    return of(true);
  }

  /**
   * Checks is the user is authenticated.
   * @return {boolean} True if the user is authenticated.
   */
  isAuthenticated(): boolean {
    return !!this.credentials;
  }

  /**
   * Gets the user credentials.
   * @return {Credentials} The user credentials or null if the user is not authenticated.
   */
  get credentials(): Credentials | null {
    return this._credentials;
  }

  /**
   * Sets the user credentials.
   * The credentials may be persisted across sessions by setting the `remember` parameter to true.
   * Otherwise, the credentials are only persisted for the current session.
   * @param {Credentials=} credentials The user credentials.
   * @param {boolean=} remember True to remember credentials across sessions.
   */
  private setCredentials(credentials?: Credentials, remember?: boolean) {
    this._credentials = credentials || null;

    if (credentials) {
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem(credentialsKey, JSON.stringify(credentials));
    } else {
      sessionStorage.removeItem(credentialsKey);
      localStorage.removeItem(credentialsKey);
    }
  }



}
