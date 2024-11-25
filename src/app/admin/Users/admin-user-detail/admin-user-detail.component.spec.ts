import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUserDetailComponent } from './admin-user-detail.component';
import { MaterialModule } from '@app/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AdminService } from '@app/admin/admin.service';
import { AdminNewComponent } from '../admin-new/admin-new.component';
import { AdminGroupsListEditComponent } from '@app/admin/Groups/admin-groups-list-edit/admin-groups-list-edit.component';
import { AdminGroupListComponent } from '@app/admin/Groups/admin-group-list/admin-group-list.component';
import { AdminPermissionListComponent } from '@app/admin/Permissions/admin-permission-list/admin-permission-list.component';
import { AdminPermissionsListEditComponent } from '@app/admin/Permissions/admin-permissions-list-edit/admin-permissions-list-edit.component';
import { SharedModule } from '@shared';
import { CredentialsService } from '@app/auth';
import { MockCredentialsService } from '@app/auth/credentials.service.mock';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('AdminUserDetailComponent', () => {
  let component: AdminUserDetailComponent;
  let fixture: ComponentFixture<AdminUserDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AdminUserDetailComponent,
        AdminNewComponent,
        AdminGroupsListEditComponent,
        AdminGroupListComponent,
        AdminPermissionListComponent,
        AdminPermissionsListEditComponent,
      ],
      imports: [
        MaterialModule,
        BrowserAnimationsModule,
        FlexLayoutModule,
        TranslateModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        SharedModule,
      ],
      providers: [
        AdminService,
        { provide: CredentialsService, useClass: MockCredentialsService },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUserDetailComponent);
    component = fixture.componentInstance;
    component.user = {
      name: 'Randall',
      lastName: 'Valenciano',
      userName: 'randy',
      email: 'ravf.226@gmail.com',
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
