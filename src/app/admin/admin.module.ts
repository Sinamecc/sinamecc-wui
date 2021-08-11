import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AdminRoutingModule } from '@app/admin/admin-routing.module';
import { AdminPermissionsNewComponent } from './Permissions/admin-permissions-new/admin-permissions-new.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '@core';
import { SharedModule } from '@shared';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '@app/material.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { AdminService } from '@app/admin/admin.service';
import { AdminPermissionListComponent } from './Permissions/admin-permission-list/admin-permission-list.component';
import { AdminPermissionsComponent } from './Permissions/admin-permissions/admin-permissions.component';
import { AdminPermissionsDetailComponent } from './Permissions/admin-permissions-detail/admin-permissions-detail.component';
import { AdminPermissionsListEditComponent } from './Permissions/admin-permissions-list-edit/admin-permissions-list-edit.component';
import { AdminGroupListComponent } from './Groups/admin-group-list/admin-group-list.component';
import { AdminGroupsComponent } from './Groups/admin-groups/admin-groups.component';
import { AdminGroupsListEditComponent } from './Groups/admin-groups-list-edit/admin-groups-list-edit.component';
import { AdminGroupsNewComponent } from './Groups/admin-groups-new/admin-groups-new.component';
import { AdminEditPasswordDialogComponent } from './admin-edit-password-dialog/admin-edit-password-dialog.component';
import { AdminNewComponent } from './Users/admin-new/admin-new.component';
import { AdminUserDetailComponent } from './Users/admin-user-detail/admin-user-detail.component';
import { AdminUsersComponent } from './Users/admin-users/admin-users.component';

@NgModule({
  declarations: [
    AdminNewComponent,
    AdminPermissionsNewComponent,
    AdminPermissionListComponent,
    AdminPermissionsComponent,
    AdminPermissionsDetailComponent,
    AdminPermissionsListEditComponent,
    AdminGroupListComponent,
    AdminGroupsComponent,
    AdminGroupsListEditComponent,
    AdminGroupsNewComponent,
    AdminEditPasswordDialogComponent,
    AdminUserDetailComponent,
    AdminUsersComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    FormsModule,
    CoreModule,
    SharedModule,
    FlexLayoutModule,
    MaterialModule,
    MatPaginatorModule,
    AdminRoutingModule,
  ],
  providers: [AdminService, DatePipe],
  exports: [AdminNewComponent],
})
export class AdminModule {}
