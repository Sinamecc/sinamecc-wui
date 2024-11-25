import { TestBed, inject } from '@angular/core/testing';

import { AdminService } from './admin.service';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CredentialsService } from '@app/auth';

describe('AdminService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        AdminService,
        CredentialsService,
        HttpClient,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
  });

  it('should be created', inject([AdminService, CredentialsService, HttpClient], (service: AdminService) => {
    expect(service).toBeTruthy();
  }));
});
