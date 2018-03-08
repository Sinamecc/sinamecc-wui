import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { MaterialModule } from '@app/material.module';
import { MitigationActionsRoutingModule } from './mitigation-actions-routing.module';
import { MitigationActionsListComponent } from './mitigation-actions-list/mitigation-actions-list.component';
import { MitigationActionsService } from './mitigation-actions.service';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    CoreModule,
    SharedModule,
    FlexLayoutModule,
    MaterialModule,
    MitigationActionsRoutingModule
  ],
  declarations: [
    MitigationActionsListComponent
  ],
  providers: [
    MitigationActionsService
  ]
})
export class MitigationActionsModule { }
