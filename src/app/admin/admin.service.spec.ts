import { TestBed, inject } from '@angular/core/testing';

import { AdminService } from './admin.service';
import { AuthenticationService } from '@app/core';
import { HttpClient } from '@angular/common/http';


describe('AdminService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdminService, AuthenticationService, HttpClient]
    });
  });

  it('should be created', inject([AdminService, AuthenticationService, HttpClient], (service: AdminService) => {
    expect(service).toBeTruthy();
  }));
});
