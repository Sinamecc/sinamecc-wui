import { TestBed, inject } from '@angular/core/testing';

import { PpcnService } from '@app/ppcn/ppcn.service';

describe('PpcnService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PpcnService]
    });
  });

  it('should be created', inject([PpcnService], (service: PpcnService) => {
    expect(service).toBeTruthy();
  }));
});
