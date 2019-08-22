import { TestBed, inject } from '@angular/core/testing';

import { AdminService } from './admin.service';
import { AuthenticationService } from '@app/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';


describe('AdminService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AdminService, AuthenticationService, HttpClient]
    });
  });

  it('should be created', inject([AdminService, AuthenticationService, HttpClient], (service: AdminService) => {
    expect(service).toBeTruthy();
  }));
});
