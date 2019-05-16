import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPermissionsDetailComponent } from './admin-permissions-detail.component';

describe('AdminPermissionsDetailComponent', () => {
  let component: AdminPermissionsDetailComponent;
  let fixture: ComponentFixture<AdminPermissionsDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminPermissionsDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPermissionsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
