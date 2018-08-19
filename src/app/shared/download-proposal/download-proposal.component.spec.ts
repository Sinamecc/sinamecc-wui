import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadProposalComponent } from '@app/shared/download-proposal/download-proposal.component';

describe('DownloadProposalComponent', () => {
  let component: DownloadProposalComponent;
  let fixture: ComponentFixture<DownloadProposalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadProposalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadProposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
