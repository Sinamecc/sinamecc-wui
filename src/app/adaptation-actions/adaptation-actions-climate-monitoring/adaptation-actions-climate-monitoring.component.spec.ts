import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdaptationActionsClimateMonitoringComponent } from './adaptation-actions-climate-monitoring.component';

describe('AdaptationActionsClimateMonitoringComponent', () => {
  let component: AdaptationActionsClimateMonitoringComponent;
  let fixture: ComponentFixture<AdaptationActionsClimateMonitoringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdaptationActionsClimateMonitoringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdaptationActionsClimateMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
