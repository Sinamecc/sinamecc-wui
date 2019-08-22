import { TestBed, inject } from '@angular/core/testing';

import { MccrPocService } from './mccr-poc.service';

describe('MccrPocService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MccrPocService]
    });
  });

  it('should be created', inject([MccrPocService], (service: MccrPocService) => {
    expect(service).toBeTruthy();
  }));
});
