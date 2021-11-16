import { Credentials } from './credentials.service';

export class MockCredentialsService {
  credentials: Credentials | null = {
    username: 'test',
    token: '123',
    id: 24,
    email: 'test@test.com',
    groups: {},
    permissions: {
      all: {
        reviewer: false,
        provider: false,
        admin: false,
      },
      ma: {
        reviewer: false,
        provider: false,
      },
      ppcn: {
        reviewer: false,
        provider: false,
      },
      mccr: {
        reviewer: false,
        provider: false,
      },
      report_data: {
        reviewer: false,
        provider: false,
      },
    },
    is_administrador_dcc: false,
  };

  isAuthenticated(): boolean {
    return !!this.credentials;
  }

  setCredentials(credentials?: Credentials, _remember?: boolean) {
    this.credentials = credentials || null;
  }
}
