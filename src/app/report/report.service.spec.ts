import { TestBed, inject } from '@angular/core/testing';

import { ReportService } from '@app/report/report.service';
import { AuthenticationService, MockAuthenticationService, S3Service } from '@app/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MockS3Service } from '@app/core/s3.service.mock';

describe('ReportService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [ReportService,
        { provide: AuthenticationService, useClass: MockAuthenticationService },
        { provide: S3Service, useClass: MockS3Service }]
    });
  });

  it('should be created', inject([ReportService], (service: ReportService) => {
    expect(service).toBeTruthy();
  }));
});
