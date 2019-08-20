import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OvvProposalComponent } from './ovv-proposal.component';

describe('OvvProposalComponent', () => {
  let component: OvvProposalComponent;
  let fixture: ComponentFixture<OvvProposalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OvvProposalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OvvProposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
