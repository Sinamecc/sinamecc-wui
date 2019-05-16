import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEditPasswordDialogComponent } from './admin-edit-password-dialog.component';

describe('AdminEditPasswordDialogComponent', () => {
  let component: AdminEditPasswordDialogComponent;
  let fixture: ComponentFixture<AdminEditPasswordDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminEditPasswordDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminEditPasswordDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
