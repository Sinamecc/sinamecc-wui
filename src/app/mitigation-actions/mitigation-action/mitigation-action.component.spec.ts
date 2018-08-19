import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MitigationActionComponent } from '@app/mitigation-actions/mitigation-action/mitigation-action.component';

describe('MitigationActionComponent', () => {
  let component: MitigationActionComponent;
  let fixture: ComponentFixture<MitigationActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MitigationActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MitigationActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
