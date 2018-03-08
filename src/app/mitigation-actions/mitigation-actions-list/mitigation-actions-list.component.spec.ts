import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MitigationActionsListComponent } from './mitigation-actions-list.component';

describe('MitigationActionsListComponent', () => {
  let component: MitigationActionsListComponent;
  let fixture: ComponentFixture<MitigationActionsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MitigationActionsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MitigationActionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
