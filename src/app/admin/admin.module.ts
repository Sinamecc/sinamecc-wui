import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminNewComponent } from './admin-new/admin-new.component';
import { AdminRoutingModule } from './admin-routing.module';

import { TranslateModule } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from '@app/material.module';

import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { AdminPermissionListComponent } from './admin-permission-list/admin-permission-list.component';
import { AdminGroupListComponent } from './admin-group-list/admin-group-list.component';
import { AdminService } from './admin.service';
import { MatPaginatorModule } from '@angular/material'

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
    AdminRoutingModule,MatPaginatorModule
  ],
  declarations: [AdminNewComponent, AdminPermissionListComponent, AdminGroupListComponent],
  entryComponents: [AdminPermissionListComponent,AdminGroupListComponent],
  providers: [
    AdminService,
    DatePipe
  ]
})
export class AdminModule { }
