import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { Credentials, LoginContext } from '@app/core/authentication/authentication.service';


export class MockAuthenticationService {
  credentials: Credentials | null = {
    username: 'test',
    fullName: 'test test',
    token: '123',
    id: 24,
    userPhoto: '',
    email: 'test@test.com',
    groups: {},
    permissions: {
      all: {
        reviewer: false,
        provider: false,
        admin: false
       },
       ma: {
        reviewer: false,
        provider: false
      },
      ppcn: {
          reviewer: false,
          provider: false
      },
      mccr: {
          reviewer: false,
          provider: false
      },
      report_data: {
          reviewer: false,
          provider: false
      },
    },
    is_administrador_dcc: false
  };

  login(context: LoginContext): Observable<Credentials> {
    return of({
      fullName: 'test test',
      username: context.username,
      token: '123456',
      id: 24,
      email: 'test@test.com',
      userPhoto: '',
      groups: {},
      permissions: {
        all: {
          reviewer: false,
          provider: false,
          admin: false
         },
         ma: {
          reviewer: false,
          provider: false
        },
        ppcn: {
            reviewer: false,
            provider: false
        },
        mccr: {
            reviewer: false,
            provider: false
        },
        report_data: {
            reviewer: false,
            provider: false
        },
      },
      is_administrador_dcc: false

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
