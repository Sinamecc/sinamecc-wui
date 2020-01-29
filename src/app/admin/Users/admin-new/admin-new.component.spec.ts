import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminNewComponent } from './admin-new.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '@app/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService, MockAuthenticationService } from '@app/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AdminPermissionListComponent } from '@app/admin/Permissions/admin-permission-list/admin-permission-list.component';
import { AdminGroupListComponent } from '@app/admin/Groups/admin-group-list/admin-group-list.component';
import { AdminService } from '@app/admin/admin.service';
import { AdminGroupsListEditComponent } from '@app/admin/Groups/admin-groups-list-edit/admin-groups-list-edit.component';
import { AdminPermissionsListEditComponent } from '@app/admin/Permissions/admin-permissions-list-edit/admin-permissions-list-edit.component';

describe('AdminNewComponent', () => {
  let component: AdminNewComponent;
  let fixture: ComponentFixture<AdminNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminNewComponent,
                      AdminPermissionListComponent,
                      AdminGroupListComponent,
                      AdminGroupsListEditComponent,
                      AdminPermissionsListEditComponent],
      imports: [
        MaterialModule,
        BrowserAnimationsModule,
        FlexLayoutModule,
        TranslateModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [AdminService, { provide: AuthenticationService, useClass: MockAuthenticationService }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
