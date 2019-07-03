import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringProposalVerificationNewComponent } from './monitoring-proposal-verification-new.component';

describe('MonitoringProposalVerificationNewComponent', () => {
  let component: MonitoringProposalVerificationNewComponent;
  let fixture: ComponentFixture<MonitoringProposalVerificationNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitoringProposalVerificationNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoringProposalVerificationNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
