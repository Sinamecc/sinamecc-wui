import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup } from "@angular/forms";
import { MatSnackBar } from "@angular/material";
import { AdaptationActionsActionImpactComponent } from "../adaptation-actions-action-impact/adaptation-actions-action-impact.component";
import { AdaptationActionsClimateMonitoringComponent } from "../adaptation-actions-climate-monitoring/adaptation-actions-climate-monitoring.component";
import { AdaptationActionsFinancingComponent } from "../adaptation-actions-financing/adaptation-actions-financing.component";
import { AdaptationActionsIndicatorsComponent } from "../adaptation-actions-indicators/adaptation-actions-indicators.component";
import { AdaptationActionsReportComponent } from "../adaptation-actions-report/adaptation-actions-report.component";
import { GeneralRegisterComponent } from "../general-register/general-register.component";
import { AdaptationAction } from "../interfaces/adaptationAction";

@Component({
	selector: "app-adaptation-actions-new",
	templateUrl: "./adaptation-actions-new.component.html",
	styleUrls: ["./adaptation-actions-new.component.scss"]
})
export class AdaptationActionsNewComponent implements OnInit {
	durationInSeconds = 3;

	@ViewChild(GeneralRegisterComponent)
	generalRegisterForm: GeneralRegisterComponent;

	@ViewChild(AdaptationActionsReportComponent)
	reportForm: AdaptationActionsReportComponent;

	@ViewChild(AdaptationActionsFinancingComponent)
	financingForm: AdaptationActionsFinancingComponent;

	@ViewChild(AdaptationActionsIndicatorsComponent)
	indicatorForm: AdaptationActionsIndicatorsComponent;

	@ViewChild(AdaptationActionsClimateMonitoringComponent)
	climateMonitoringForm: AdaptationActionsClimateMonitoringComponent;

	@ViewChild(AdaptationActionsActionImpactComponent)
	impactForm: AdaptationActionsActionImpactComponent;

	mainGroup: FormGroup;

	constructor(
		private _formBuilder: FormBuilder,
		private cdRef: ChangeDetectorRef
	) {
		this.createForm();
	}

	get formArray(): AbstractControl | null {
		return this.mainGroup.get("formArray");
	}

	ngOnInit() {}

	createForm() {
		this.mainGroup = this._formBuilder.group({
			// this.formBuilder.array([])
			formArray: this._formBuilder.array([
				this.generalRegisterFrm,
				this.reportFrm,
				this.financingFrm,
				this.indicatorFrm,
				this.climateMoniotoringFrm,
				this.impactFrm
			])
		});
	}

	get generalRegisterFrm() {
		return this.generalRegisterForm ? this.generalRegisterForm.form : null;
	}

	get reportFrm() {
		return this.reportForm ? this.reportForm.form : null;
	}

	get financingFrm() {
		return this.financingForm ? this.financingForm.form : null;
	}

	get indicatorFrm() {
		return this.indicatorForm ? this.indicatorForm.form : null;
	}

	get climateMoniotoringFrm() {
		return this.climateMonitoringForm ? this.climateMonitoringForm.form : null;
	}

	get impactFrm() {
		return this.impactForm ? this.impactForm.form : null;
	}

	ngAfterViewInit() {
		this.cdRef.detectChanges();
		setTimeout(() => this.createForm(), 0);
	}
}
