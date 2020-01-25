import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminNewComponent } from './Users/admin-new/admin-new.component';
import { AdminRoutingModule } from './admin-routing.module';

import { TranslateModule } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from '@app/material.module';

import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { AdminPermissionListComponent } from './Permissions/admin-permission-list/admin-permission-list.component';
import { AdminGroupListComponent } from './Groups/admin-group-list/admin-group-list.component';
import { AdminService } from './admin.service';
import { MatPaginatorModule } from '@angular/material';
import { AdminUsersComponent } from './Users/admin-users/admin-users.component';
import { AdminPermissionsComponent } from './Permissions/admin-permissions/admin-permissions.component';
import { AdminPermissionsNewComponent } from './Permissions/admin-permissions-new/admin-permissions-new.component';
import { AdminGroupsComponent } from './Groups/admin-groups/admin-groups.component';
import { AdminGroupsNewComponent } from './Groups/admin-groups-new/admin-groups-new.component';
import { AdminUserDetailComponent } from './Users/admin-user-detail/admin-user-detail.component';
import { AdminPermissionsListEditComponent } from './Permissions/admin-permissions-list-edit/admin-permissions-list-edit.component';
import { AdminGroupsListEditComponent } from './Groups/admin-groups-list-edit/admin-groups-list-edit.component';
import { AdminEditPasswordDialogComponent } from './admin-edit-password-dialog/admin-edit-password-dialog.component';
import { AdminPermissionsDetailComponent } from './Permissions/admin-permissions-detail/admin-permissions-detail.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    FormsModule,
    CoreModule,
    SharedModule,
    FlexLayoutModule,
    MaterialModule,
    AdminRoutingModule, MatPaginatorModule
  ],
  declarations: [AdminNewComponent, AdminPermissionListComponent, AdminGroupListComponent, AdminUsersComponent, AdminPermissionsComponent, AdminPermissionsNewComponent, AdminGroupsComponent,
    AdminGroupsNewComponent, AdminUserDetailComponent, AdminPermissionsListEditComponent, AdminGroupsListEditComponent, AdminEditPasswordDialogComponent, AdminPermissionsDetailComponent],
  entryComponents: [AdminPermissionListComponent, AdminGroupListComponent, AdminUserDetailComponent, AdminEditPasswordDialogComponent, AdminPermissionsDetailComponent],
  providers: [
    AdminService,
    DatePipe
  ]
})
export class AdminModule { }
