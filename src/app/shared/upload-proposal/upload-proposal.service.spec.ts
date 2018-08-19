import { TestBed, inject } from '@angular/core/testing';

import { UploadProposalService } from '@app/shared/upload-proposal/upload-proposal.service';

describe('UploadProposalService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UploadProposalService]
    });
  });

  it('should be created', inject([UploadProposalService], (service: UploadProposalService) => {
    expect(service).toBeTruthy();
  }));
});
