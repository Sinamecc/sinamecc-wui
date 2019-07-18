import { TestBed, inject } from '@angular/core/testing';

import { MccrRegistriesService } from '@app/mccr-registries/mccr-registries.service';
import { AuthenticationService, MockAuthenticationService } from '@app/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DatePipe } from '@angular/common';
import { S3Service } from '@app/core/s3.service';
import { MockS3Service } from '@app/core/s3.service.mock';

describe('MccrRegistriesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [MccrRegistriesService,
        DatePipe,
        { provide: AuthenticationService, useClass: MockAuthenticationService },
        { provide: S3Service, useClass: MockS3Service }]
    });
  });

  it('should be created', inject([MccrRegistriesService], (service: MccrRegistriesService) => {
    expect(service).toBeTruthy();
  }));
});
