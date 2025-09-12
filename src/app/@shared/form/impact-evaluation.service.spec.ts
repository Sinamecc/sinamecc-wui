import { TestBed } from '@angular/core/testing';

import { ImpactEvaluationService } from './impact-evaluation.service';

describe('ImpactEvaluationService', () => {
  let service: ImpactEvaluationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImpactEvaluationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
