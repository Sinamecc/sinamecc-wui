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
		AdaptationActionsIndicatorsComponent
	]
})
export class AdaptationActionsModule {}
