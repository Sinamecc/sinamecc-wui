import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPermissionsListEditComponent } from './admin-permissions-list-edit.component';

describe('AdminPermissionsListEditComponent', () => {
  let component: AdminPermissionsListEditComponent;
  let fixture: ComponentFixture<AdminPermissionsListEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminPermissionsListEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPermissionsListEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
