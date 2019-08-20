import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringProposalNewComponent } from './monitoring-proposal-new.component';

describe('MonitoringProposalNewComponent', () => {
  let component: MonitoringProposalNewComponent;
  let fixture: ComponentFixture<MonitoringProposalNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitoringProposalNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoringProposalNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
