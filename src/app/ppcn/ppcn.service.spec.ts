import { TestBed, inject } from '@angular/core/testing';

import { PpcnService } from '@app/ppcn/ppcn.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MockS3Service } from '@app/s3.service.mock';
import { DatePipe } from '@angular/common';
import { CredentialsService } from '@app/auth';
import { MockCredentialsService } from '@app/auth/credentials.service.mock';
import { S3Service } from '@app/s3.service';

describe('PpcnService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PpcnService,
        DatePipe,
        { provide: CredentialsService, useClass: MockCredentialsService },
        { provide: S3Service, useClass: MockS3Service },
      ],
    });
  });

  it('should be created', inject([PpcnService], (service: PpcnService) => {
    expect(service).toBeTruthy();
  }));
});
