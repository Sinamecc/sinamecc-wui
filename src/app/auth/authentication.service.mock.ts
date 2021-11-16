import { Observable, of } from 'rxjs';

import { LoginContext } from './authentication.service';
import { Credentials } from './credentials.service';

export class MockAuthenticationService {
  credentials: Credentials | null = {
    id: 123,
    username: 'test',
    token: '123',
    email: 'john@mail.com',
    groups: [],
    permissions: undefined,
    is_administrador_dcc: false,
  };

  login(context: LoginContext): Observable<Credentials> {
    return of({
      id: 123,
      username: context.username,
      token: '123456',
      email: 'john@mail.com',
      groups: [],
      permissions: undefined,
      is_administrador_dcc: false,
    });
  }

  logout(): Observable<boolean> {
    this.credentials = null;
    return of(true);
  }
}
