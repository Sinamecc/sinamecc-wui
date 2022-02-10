import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdaptationActionsNewComponent } from "./adaptation-actions-new/adaptation-actions-new.component";
import { AdaptationActionsRoutingModule } from "./adaptation-actions-routing.module";
import { GeneralRegisterComponent } from "./general-register/general-register.component";
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CoreModule } from "@app/core";
import { SharedModule } from "@app/shared";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MaterialModule } from "@app/material.module";
import { AdaptationActionsReportComponent } from "./adaptation-actions-report/adaptation-actions-report.component";
import { AdaptationActionsFinancingComponent } from "./adaptation-actions-financing/adaptation-actions-financing.component";
import { AdaptationActionsIndicatorsComponent } from "./adaptation-actions-indicators/adaptation-actions-indicators.component";
import { AdaptationActionsClimateMonitoringComponent } from "./adaptation-actions-climate-monitoring/adaptation-actions-climate-monitoring.component";
import { AdaptationActionsActionImpactComponent } from "./adaptation-actions-action-impact/adaptation-actions-action-impact.component";
import { AdaptationActionService } from "./adaptation-actions-service";
import { AdaptationActionsListComponent } from "./adaptation-actions-list/adaptation-actions-list.component";

@NgModule({
	imports: [
		CommonModule,
		AdaptationActionsRoutingModule,
		TranslateModule,
		ReactiveFormsModule,
		FormsModule,
		CoreModule,
		SharedModule,
		FlexLayoutModule,
		MaterialModule
	],
	declarations: [
		AdaptationActionsNewComponent,
		GeneralRegisterComponent,
		AdaptationActionsReportComponent,
		AdaptationActionsFinancingComponent,
		AdaptationActionsIndicatorsComponent,
		AdaptationActionsClimateMonitoringComponent,
		AdaptationActionsActionImpactComponent,
		AdaptationActionsListComponent
	],
	providers: [AdaptationActionService]
})
export class AdaptationActionsModule {}
