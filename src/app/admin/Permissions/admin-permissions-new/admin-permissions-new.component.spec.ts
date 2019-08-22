import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPermissionsNewComponent } from './admin-permissions-new.component';

describe('AdminPermissionsNewComponent', () => {
  let component: AdminPermissionsNewComponent;
  let fixture: ComponentFixture<AdminPermissionsNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminPermissionsNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPermissionsNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
