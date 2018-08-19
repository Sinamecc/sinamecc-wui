import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadProposalComponent } from '@app/shared/upload-proposal/upload-proposal.component';

describe('UploadProposalComponent', () => {
  let component: UploadProposalComponent;
  let fixture: ComponentFixture<UploadProposalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadProposalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadProposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
