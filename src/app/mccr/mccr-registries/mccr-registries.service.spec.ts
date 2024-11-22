import { TestBed, inject } from '@angular/core/testing';

import { MccrRegistriesService } from '@app/mccr/mccr-registries/mccr-registries.service';
import { CredentialsService } from '@app/auth';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { DatePipe } from '@angular/common';
import { S3Service } from '@shared/s3.service';
import { MockS3Service } from '@shared/s3.service.mock';
import { MockCredentialsService } from '@app/auth/credentials.service.mock';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('MccrRegistriesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        MccrRegistriesService,
        DatePipe,
        { provide: CredentialsService, useClass: MockCredentialsService },
        { provide: S3Service, useClass: MockS3Service },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
  });

  it('should be created', inject([MccrRegistriesService], (service: MccrRegistriesService) => {
    expect(service).toBeTruthy();
  }));
});
