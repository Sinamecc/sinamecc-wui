import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";

import { CoreModule } from "@app/core";
import { SharedModule } from "@app/shared";
import { MaterialModule } from "@app/material.module";
import { MitigationActionsRoutingModule } from "@app/mitigation-actions/mitigation-actions-routing.module";
import { MitigationActionsListComponent } from "@app/mitigation-actions/mitigation-actions-list/mitigation-actions-list.component";
import { MitigationActionsService } from "@app/mitigation-actions/mitigation-actions.service";
import { MitigationActionsNewComponent } from "@app/mitigation-actions/mitigation-actions-new/mitigation-actions-new.component";
import { DatePipe } from "@angular/common";
import { MitigationActionComponent } from "@app/mitigation-actions/mitigation-action/mitigation-action.component";
import { MitigationActionsUpdateComponent } from "@app/mitigation-actions/mitigation-actions-update/mitigation-actions-update.component";
import { MitigationActionReviewsNewComponent } from "@app/mitigation-actions/mitigation-action-reviews/mitigation-action-reviews-new/mitigation-action-reviews-new.component";
import { MitigationActionsReviewsListComponent } from "@app/mitigation-actions/mitigation-action-reviews/mitigation-actions-reviews-list/mitigation-actions-reviews-list.component";
import { ConceptualIntegrationComponent } from "@app/mitigation-actions/conceptual-integration/conceptual-integration.component";
import { IngeiHarmonizationComponent } from "@app/mitigation-actions/ingei-harmonization/ingei-harmonization.component";
import { ConceptualIntegrationNewComponent } from "@app/mitigation-actions/conceptual-integration-new/conceptual-integration-new.component";
import { HarmonizationProposalNewComponent } from "@app/mitigation-actions/harmonization-proposal-new/harmonization-proposal-new.component";
import { MitigationActionFormFlowComponent } from "./mitigation-action-form-flow/mitigation-action-form-flow.component";
import { InitiativeFormComponent } from "./initiative-form/initiative-form.component";
import { BasicInformationFormComponent } from "./basic-information-form/basic-information-form.component";
import { KeyAspectsFormComponent } from "./key-aspects-form/key-aspects-form.component";
import { EmissionsMitigationFormComponent } from "./emissions-mitigation-form/emissions-mitigation-form.component";
import { ImpactFormComponent } from "./impact-form/impact-form.component";
import { ReportingClimateActionFormComponent } from "./reporting-climate-action-form/reporting-climate-action-form.component";
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
		IngeiHarmonizationComponent,
		ConceptualIntegrationNewComponent,
		HarmonizationProposalNewComponent,
		MitigationActionFormFlowComponent,
		InitiativeFormComponent,
		BasicInformationFormComponent,
		KeyAspectsFormComponent,
		EmissionsMitigationFormComponent,
		ImpactFormComponent,
		ReportingClimateActionFormComponent
	],
	providers: [MitigationActionsService, DatePipe]
})
export class MitigationActionsModule {}
