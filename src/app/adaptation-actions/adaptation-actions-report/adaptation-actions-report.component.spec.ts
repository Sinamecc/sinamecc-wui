import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdaptationActionsReportComponent } from './adaptation-actions-report.component';

describe('AdaptationActionsReportComponent', () => {
  let component: AdaptationActionsReportComponent;
  let fixture: ComponentFixture<AdaptationActionsReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdaptationActionsReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdaptationActionsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
