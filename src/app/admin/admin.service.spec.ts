import { TestBed, inject } from '@angular/core/testing';

import { AdminService } from './admin.service';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CredentialsService } from '@app/auth';

describe('AdminService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AdminService, CredentialsService, HttpClient],
    });
  });

  it('should be created', inject([AdminService, CredentialsService, HttpClient], (service: AdminService) => {
    expect(service).toBeTruthy();
  }));
});
