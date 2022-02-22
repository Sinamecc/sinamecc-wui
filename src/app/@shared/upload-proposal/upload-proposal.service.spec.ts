import { TestBed } from '@angular/core/testing';

import { UploadProposalService } from './upload-proposal.service';

describe('UploadProposalService', () => {
  let service: UploadProposalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UploadProposalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
