import { TestBed, inject } from '@angular/core/testing';

import { MccrPocService } from './mccr-poc.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('MccrPocService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [MccrPocService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    });
  });

  it('should be created', inject([MccrPocService], (service: MccrPocService) => {
    expect(service).toBeTruthy();
  }));
});
