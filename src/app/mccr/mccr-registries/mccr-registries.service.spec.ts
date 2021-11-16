import { TestBed, inject } from '@angular/core/testing';

import { MccrRegistriesService } from '@app/mccr/mccr-registries/mccr-registries.service';
import { CredentialsService } from '@app/auth';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DatePipe } from '@angular/common';
import { S3Service } from '@shared/s3.service';
import { MockS3Service } from '@shared/s3.service.mock';
import { MockCredentialsService } from '@app/auth/credentials.service.mock';

describe('MccrRegistriesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        MccrRegistriesService,
        DatePipe,
        { provide: CredentialsService, useClass: MockCredentialsService },
        { provide: S3Service, useClass: MockS3Service },
      ],
    });
  });

  it('should be created', inject([MccrRegistriesService], (service: MccrRegistriesService) => {
    expect(service).toBeTruthy();
  }));
});
