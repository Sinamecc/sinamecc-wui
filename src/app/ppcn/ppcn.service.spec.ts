import { TestBed, inject } from '@angular/core/testing';

import { PpcnService } from './ppcn.service';

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
