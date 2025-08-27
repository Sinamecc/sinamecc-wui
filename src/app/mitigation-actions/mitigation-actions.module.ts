import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { CoreModule } from '@core';
import { SharedModule } from '@shared';
import { MaterialModule } from '@app/material.module';
import { MitigationActionsRoutingModule } from '@app/mitigation-actions/mitigation-actions-routing.module';
import { MitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service';

import { DatePipe } from '@angular/common';
import { MitigationActionsListComponent } from './mitigation-actions-list/mitigation-actions-list.component';
import { MitigationActionsNewComponent } from './mitigation-actions-new/mitigation-actions-new.component';
import { MitigationActionFormFlowComponent } from './mitigation-action-form-flow/mitigation-action-form-flow.component';
import { InitiativeFormComponent } from './initiative-form/initiative-form.component';
import { BasicInformationFormComponent } from './basic-information-form/basic-information-form.component';
import { KeyAspectsFormComponent } from './key-aspects-form/key-aspects-form.component';
import { EmissionsMitigationFormComponent } from './emissions-mitigation-form/emissions-mitigation-form.component';
import { ImpactFormComponent } from './impact-form/impact-form.component';
import { MitigationActionComponent } from './mitigation-action/mitigation-action.component';
import { MitigationActionsUpdateComponent } from './mitigation-actions-update/mitigation-actions-update.component';
import { MitigationActionReviewsListComponent } from './mitigation-action-reviews/mitigation-action-reviews-list/mitigation-action-reviews-list.component';
import { ConceptualIntegrationComponent } from './conceptual-integration/conceptual-integration.component';
import { IngeiHarmonizationComponent } from './ingei-harmonization/ingei-harmonization.component';
import { MitigationActionReviewsNewComponent } from './mitigation-action-reviews/mitigation-action-reviews-new/mitigation-action-reviews-new.component';
import { ConceptualIntegrationNewComponent } from './conceptual-integration-new/conceptual-integration-new.component';
import { HarmonizationProposalNewComponent } from './harmonization-proposal-new/harmonization-proposal-new.component';
import { ReportingClimateActionFormComponent } from './reporting-climate-action-form/reporting-climate-action-form.component';
import { OrderByIdPipe } from '@app/@shared/order-by-id.pipe';
import { MitigationActionFileUploadComponent } from './mitigation-action-file-upload/mitigation-action-file-upload.component';
@NgModule({
  declarations: [
    MitigationActionsListComponent,
    MitigationActionsNewComponent,
    MitigationActionComponent,
    MitigationActionsUpdateComponent,
    MitigationActionReviewsNewComponent,
    MitigationActionReviewsListComponent,
    ConceptualIntegrationComponent,
    IngeiHarmonizationComponent,
    ConceptualIntegrationNewComponent,
    HarmonizationProposalNewComponent,
    MitigationActionFormFlowComponent,
    InitiativeFormComponent,
    BasicInformationFormComponent,
    KeyAspectsFormComponent,
    EmissionsMitigationFormComponent,
    ImpactFormComponent,
    ReportingClimateActionFormComponent,
    MitigationActionFileUploadComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    FormsModule,
    CoreModule,
    SharedModule,
    MaterialModule,
    MitigationActionsRoutingModule,
    OrderByIdPipe,
  ],
  providers: [MitigationActionsService, DatePipe],
})
export class MitigationActionsModule {}
