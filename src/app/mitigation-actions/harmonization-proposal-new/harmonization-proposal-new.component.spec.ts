import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HarmonizationProposalNewComponent } from '@app/mitigation-actions/harmonization-proposal-new/harmonization-proposal-new.component';

describe('HarmonizationProposalNewComponent', () => {
  let component: HarmonizationProposalNewComponent;
  let fixture: ComponentFixture<HarmonizationProposalNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HarmonizationProposalNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HarmonizationProposalNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
