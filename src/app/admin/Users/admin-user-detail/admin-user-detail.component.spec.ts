import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUserDetailComponent } from './admin-user-detail.component';
import { MaterialModule } from '@app/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AdminService } from '@app/admin/admin.service';
import { AuthenticationService, MockAuthenticationService } from '@app/core';
import { AdminNewComponent } from '../admin-new/admin-new.component';
import { AdminGroupsListEditComponent } from '@app/admin/Groups/admin-groups-list-edit/admin-groups-list-edit.component';
import { AdminGroupListComponent } from '@app/admin/Groups/admin-group-list/admin-group-list.component';
import { AdminPermissionListComponent } from '@app/admin/Permissions/admin-permission-list/admin-permission-list.component';
import { AdminPermissionsListEditComponent } from '@app/admin/Permissions/admin-permissions-list-edit/admin-permissions-list-edit.component';

describe('AdminUserDetailComponent', () => {
  let component: AdminUserDetailComponent;
  let fixture: ComponentFixture<AdminUserDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        BrowserAnimationsModule,
        FlexLayoutModule,
        TranslateModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      declarations: [ AdminUserDetailComponent, AdminNewComponent, AdminGroupsListEditComponent, AdminGroupListComponent, AdminPermissionListComponent, AdminPermissionsListEditComponent ],
      providers: [AdminService, { provide: AuthenticationService, useClass: MockAuthenticationService }]

    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUserDetailComponent);
    component = fixture.componentInstance;
    component.user = {
      name: 'Randall',
      lastName: 'Valenciano',
      userName: 'randy',
      email: 'ravf.226@gmail.com'

    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
