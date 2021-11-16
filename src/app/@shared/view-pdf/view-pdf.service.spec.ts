import { TestBed } from '@angular/core/testing';

import { ViewPdfService } from './view-pdf.service';

describe('ViewPdfService', () => {
  let service: ViewPdfService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViewPdfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
