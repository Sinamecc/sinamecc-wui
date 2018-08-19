import { TestBed, inject } from '@angular/core/testing';

import { MitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service';

describe('MitigationActionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MitigationActionsService]
    });
  });

  it('should be created', inject([MitigationActionsService], (service: MitigationActionsService) => {
    expect(service).toBeTruthy();
  }));
});
