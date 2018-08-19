import { TestBed, inject } from '@angular/core/testing';

import { MccrRegistriesService } from '@app/mccr-registries/mccr-registries.service';

describe('MccrRegistriesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MccrRegistriesService]
    });
  });

  it('should be created', inject([MccrRegistriesService], (service: MccrRegistriesService) => {
    expect(service).toBeTruthy();
  }));
});
