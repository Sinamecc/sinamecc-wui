import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MitigationActionsNewComponent } from './mitigation-actions-new.component';

describe('MitigationActionsNewComponent', () => {
  let component: MitigationActionsNewComponent;
  let fixture: ComponentFixture<MitigationActionsNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MitigationActionsNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MitigationActionsNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
