import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpactEvaluationComponent } from './impact-evaluation.component';

describe('ImpactEvaluationComponent', () => {
  let component: ImpactEvaluationComponent;
  let fixture: ComponentFixture<ImpactEvaluationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImpactEvaluationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ImpactEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
