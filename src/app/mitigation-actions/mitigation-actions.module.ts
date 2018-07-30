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
import { MitigationActionReviewsNewComponent } from './mitigation-action-reviews/mitigation-action-reviews-new/mitigation-action-reviews-new.component';
import { MitigationActionsReviewsListComponent } from './mitigation-action-reviews/mitigation-actions-reviews-list/mitigation-actions-reviews-list.component';
import { ConceptualIntegrationComponent } from './conceptual-integration/conceptual-integration.component';
import { ConceptualIntegrationNewComponent } from './conceptual-integration-new/conceptual-integration-new.component'
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
    MitigationActionsUpdateComponent,
    MitigationActionReviewsNewComponent,
    MitigationActionsReviewsListComponent,
    ConceptualIntegrationComponent,
    ConceptualIntegrationNewComponent
  ],
  providers: [
    MitigationActionsService,
    DatePipe
  ]
})
export class MitigationActionsModule { }
