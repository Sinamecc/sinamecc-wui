import { TestBed, inject } from '@angular/core/testing';

import { MitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DatePipe } from '@angular/common';
import { AuthenticationService, MockAuthenticationService, S3Service } from '@app/core';
import { MockS3Service } from '@app/core/s3.service.mock';

describe('MitigationActionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [MitigationActionsService,
        DatePipe,
        { provide: AuthenticationService, useClass: MockAuthenticationService },
        { provide: S3Service, useClass: MockS3Service }]
    });
  });

  it('should be created', inject([MitigationActionsService], (service: MitigationActionsService) => {
    expect(service).toBeTruthy();
  }));
});
