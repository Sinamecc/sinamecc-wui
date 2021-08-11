import { TestBed, inject } from '@angular/core/testing';

import { MccrPocService } from './mccr-poc.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MccrPocService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MccrPocService],
    });
  });

  it('should be created', inject([MccrPocService], (service: MccrPocService) => {
    expect(service).toBeTruthy();
  }));
});
