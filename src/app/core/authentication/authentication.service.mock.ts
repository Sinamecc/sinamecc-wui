import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { Credentials, LoginContext } from '@app/core/authentication/authentication.service';

export class MockAuthenticationService {

  credentials: Credentials | null = {
    username: 'test',
    token: '123',
    id: 24,
    email: 'test@test.com'
  };

  login(context: LoginContext): Observable<Credentials> {
    return of({
      username: context.username,
      token: '123456',
      id: 24,
      email: 'test@test.com'
    });
  }

  logout(): Observable<boolean> {
    this.credentials = null;
    return of(true);
  }

  isAuthenticated(): boolean {
    return !!this.credentials;
  }

}
