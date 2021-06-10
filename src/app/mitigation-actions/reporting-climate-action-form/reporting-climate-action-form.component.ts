import { DatePipe } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import {
	AbstractControl,
	FormBuilder,
	FormGroup,
	Validators
} from "@angular/forms";
import { MatSnackBar } from "@angular/material";
import { AuthenticationService } from "@app/core";
import { ErrorReportingComponent } from "@app/shared/error-reporting/error-reporting.component";
import { TranslateService } from "@ngx-translate/core";
import { MitigationAction } from "../mitigation-action";
import { MitigationActionsService } from "../mitigation-actions.service";

@Component({
	selector: "app-reporting-climate-action-form",
	templateUrl: "./reporting-climate-action-form.component.html",
	styleUrls: ["./reporting-climate-action-form.component.scss"]
})
export class ReportingClimateActionFormComponent implements OnInit {
	error: string;
	form: FormGroup;
	isLoading = false;
	wasSubmittedSuccessfully = false;
	mitigationAction: MitigationAction;
	@ViewChild("errorComponent") errorComponent: ErrorReportingComponent;

	constructor(
		private formBuilder: FormBuilder,
		private authenticationService: AuthenticationService,
		private service: MitigationActionsService,
		private translateService: TranslateService,
		public snackBar: MatSnackBar,
		private datePipe: DatePipe
	) {
		//this.service.currentMitigationAction.subscribe(message => {
		//	this.mitigationAction = message;
		//});
		this.createForm();
	}

	ngOnInit() {}

	get formArray(): AbstractControl | null {
		return this.form.get("formArray");
	}

	private createForm() {
		this.form = this.formBuilder.group({
			formArray: this.formBuilder.array([
				this.formBuilder.group({
					anyProgressMonitoringRecordedClimateActionsCtrl: [
						"",
						Validators.required
					]
				}),
				this.formBuilder.group({
					indicatorSelectionCtrl: ["", Validators.required],
					indicatordataUpdateDateCtrl: ["", Validators.required]
				}),

				this.formBuilder.group({
					reportingPeriodCtrl: ["", Validators.required],
					beenProgressActionPeriodCtrl: ["", Validators.required]
				})
			])
		});
	}
}
