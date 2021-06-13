import { DatePipe } from "@angular/common";
import { Component, Input, OnInit, ViewChild } from "@angular/core";
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
import { Observable } from "rxjs";
import { MitigationAction } from "../mitigation-action";
import { MitigationActionNewFormData } from "../mitigation-action-new-form-data";
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
	@Input() newFormData: Observable<MitigationActionNewFormData>;
	@Input() processedNewFormData: MitigationActionNewFormData;
	@Input() isUpdating: boolean;

	@Input() mitigationActionToUpdate?: any;
	@ViewChild("errorComponent") errorComponent: ErrorReportingComponent;

	constructor(
		private formBuilder: FormBuilder,
		private authenticationService: AuthenticationService,
		private service: MitigationActionsService,
		private translateService: TranslateService,
		public snackBar: MatSnackBar,
		private datePipe: DatePipe
	) {
		this.service.currentMitigationAction.subscribe(message => {
			this.mitigationAction = message;
		});
		this.createForm();
	}

	ngOnInit() {}

	get formArray(): AbstractControl | null {
		return this.form.get("formArray");
	}

	buildPayload() {
		const context = {
			monitoring_reporting_indicator: {
				progress_in_monitoring: this.form.value.formArray[0]
					.anyProgressMonitoringRecordedClimateActionsCtrl,
				monitoring_indicator: [
					{
						initial_date_report_period: this.form.value.formArray[1]
							.reportingPeriodStartCtrl,
						final_date_report_period: this.form.value.formArray[1]
							.reportingPeriodEndCtrl,
						data_updated_date: this.form.value.formArray[1]
							.indicatordataUpdateDateCtrl,
						updated_data: this.form.value.formArray[1]
							.informationWantUpdateCtrl,
						progress_report: this.form.value.formArray[2]
							.beenProgressActionPeriodCtrl,
						indicator: 1
					}
				]
			}
		};

		return context;
	}

	submitForm() {}

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
					indicatordataUpdateDateCtrl: ["", Validators.required],
					reportingPeriodStartCtrl: ["", Validators.required],
					reportingPeriodEndCtrl: ["", Validators.required],
					informationWantUpdateCtrl: ["", Validators.required]
				}),

				this.formBuilder.group({
					reportingPeriodCtrl: ["", Validators.required],
					beenProgressActionPeriodCtrl: ["", Validators.required]
				})
			])
		});
	}
}
