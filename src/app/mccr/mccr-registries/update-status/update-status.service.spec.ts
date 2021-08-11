import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { UpdateStatusService } from './update-status.service';
import { CredentialsService } from '@app/auth';

describe('UpdateStatusService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UpdateStatusService, CredentialsService],
    });
  });

  it('should be created', inject([UpdateStatusService], (service: UpdateStatusService) => {
    expect(service).toBeTruthy();
  }));
});
