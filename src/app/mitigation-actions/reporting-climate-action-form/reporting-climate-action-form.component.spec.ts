import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportingClimateActionFormComponent } from './reporting-climate-action-form.component';

describe('ReportingClimateActionFormComponent', () => {
  let component: ReportingClimateActionFormComponent;
  let fixture: ComponentFixture<ReportingClimateActionFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReportingClimateActionFormComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportingClimateActionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
