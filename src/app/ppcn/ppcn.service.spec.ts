import { TestBed, inject } from '@angular/core/testing';

import { PpcnService } from '@app/ppcn/ppcn.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthenticationService, MockAuthenticationService, S3Service } from '@app/core';
import { MockS3Service } from '@app/core/s3.service.mock';
import { DatePipe } from '@angular/common';

describe('PpcnService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [PpcnService, DatePipe,
        { provide: AuthenticationService, useClass: MockAuthenticationService },
        { provide: S3Service, useClass: MockS3Service }
      ]
    });
  });

  it('should be created', inject([PpcnService], (service: PpcnService) => {
    expect(service).toBeTruthy();
  }));
});
