import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MitigationActionsUpdateComponent } from './mitigation-actions-update.component';

describe('MitigationActionsUpdateComponent', () => {
  let component: MitigationActionsUpdateComponent;
  let fixture: ComponentFixture<MitigationActionsUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MitigationActionsUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MitigationActionsUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
