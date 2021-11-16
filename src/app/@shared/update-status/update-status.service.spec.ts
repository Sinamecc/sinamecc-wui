import { TestBed } from '@angular/core/testing';

import { UpdateStatusService } from './update-status.service';

describe('UpdateStatusService', () => {
  let service: UpdateStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
