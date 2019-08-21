import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { UploadProposalService } from '@app/shared/upload-proposal/upload-proposal.service';
import { AuthenticationService, MockAuthenticationService, S3Service } from '@app/core';

describe('UploadProposalService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [UploadProposalService, AuthenticationService],
    });
  });

  it('should be created', inject([UploadProposalService], (service: UploadProposalService) => {
    expect(service).toBeTruthy();
  }));
});
