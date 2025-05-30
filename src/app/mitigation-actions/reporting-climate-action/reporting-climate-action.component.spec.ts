import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportingClimateActionComponent } from './reporting-climate-action.component';

describe('ReportingClimateActionComponent', () => {
  let component: ReportingClimateActionComponent;
  let fixture: ComponentFixture<ReportingClimateActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportingClimateActionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportingClimateActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
