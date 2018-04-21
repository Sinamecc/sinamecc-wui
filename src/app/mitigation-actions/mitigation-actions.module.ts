import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';


import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { MaterialModule } from '@app/material.module';
import { MitigationActionsRoutingModule } from './mitigation-actions-routing.module';
import { MitigationActionsListComponent } from './mitigation-actions-list/mitigation-actions-list.component';
import { MitigationActionsService } from './mitigation-actions.service';
import { MitigationActionsNewComponent } from './mitigation-actions-new/mitigation-actions-new.component';
import { DatePipe } from '@angular/common';
import { MitigationActionComponent } from './mitigation-action/mitigation-action.component';
import { MitigationActionsUpdateComponent } from './mitigation-actions-update/mitigation-actions-update.component';

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
    MitigationActionsRoutingModule
  ],
  declarations: [
    MitigationActionsListComponent,
    MitigationActionsNewComponent,
    MitigationActionComponent,
    MitigationActionsUpdateComponent
  ],
  providers: [
    MitigationActionsService,
    DatePipe
  ]
})
export class MitigationActionsModule { }
