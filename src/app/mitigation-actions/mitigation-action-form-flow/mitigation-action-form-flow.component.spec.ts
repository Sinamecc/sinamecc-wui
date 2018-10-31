import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MitigationActionFormFlowComponent } from './mitigation-action-form-flow.component';

describe('MitigationActionFormFlowComponent', () => {
  let component: MitigationActionFormFlowComponent;
  let fixture: ComponentFixture<MitigationActionFormFlowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MitigationActionFormFlowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MitigationActionFormFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
