import { TestBed, inject } from '@angular/core/testing';

import { MitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DatePipe } from '@angular/common';
import { CredentialsService } from '@app/auth';
import { MockCredentialsService } from '@app/auth/credentials.service.mock';
import { S3Service, MockS3Service } from '@shared';

describe('MitigationActionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        MitigationActionsService,
        DatePipe,
        { provide: CredentialsService, useClass: MockCredentialsService },
        { provide: S3Service, useClass: MockS3Service },
      ],
    });
  });

  it('should be created', inject([MitigationActionsService], (service: MitigationActionsService) => {
    expect(service).toBeTruthy();
  }));
});
