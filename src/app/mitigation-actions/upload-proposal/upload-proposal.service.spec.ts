import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { UploadProposalService } from '@app/mitigation-actions/upload-proposal/upload-proposal.service';
import { CredentialsService } from '@app/auth';

describe('UploadProposalService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UploadProposalService, CredentialsService],
    });
  });

  it('should be created', inject([UploadProposalService], (service: UploadProposalService) => {
    expect(service).toBeTruthy();
  }));
});
