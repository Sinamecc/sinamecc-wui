import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OvvProposalNewComponent } from './ovv-proposal-new.component';

describe('OvvProposalNewComponent', () => {
  let component: OvvProposalNewComponent;
  let fixture: ComponentFixture<OvvProposalNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OvvProposalNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OvvProposalNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
