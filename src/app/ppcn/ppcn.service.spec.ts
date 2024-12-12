import { TestBed, inject } from '@angular/core/testing';

import { PpcnService } from '@app/ppcn/ppcn.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MockS3Service } from '@app/@shared/s3.service.mock';
import { DatePipe } from '@angular/common';
import { CredentialsService } from '@app/auth';
import { MockCredentialsService } from '@app/auth/credentials.service.mock';
import { S3Service } from '@shared/s3.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('PpcnService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        PpcnService,
        DatePipe,
        { provide: CredentialsService, useClass: MockCredentialsService },
        { provide: S3Service, useClass: MockS3Service },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
  });

  it('should be created', inject([PpcnService], (service: PpcnService) => {
    expect(service).toBeTruthy();
  }));
});
