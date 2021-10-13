import { DatePipe } from "@angular/common";
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import {
	AbstractControl,
	FormBuilder,
	FormGroup,
	Validators
} from "@angular/forms";
import { MatSnackBar } from "@angular/material";
import { Router } from "@angular/router";
import { AuthenticationService } from "@app/core";
import { ErrorReportingComponent } from "@app/shared/error-reporting/error-reporting.component";
import { TranslateService } from "@ngx-translate/core";
import { Observable } from "rxjs/Observable";

import { finalize } from "rxjs/operators";
import { MitigationAction } from "../mitigation-action";
import { MitigationActionNewFormData } from "../mitigation-action-new-form-data";
import { MitigationActionsService } from "../mitigation-actions.service";

@Component({
	selector: "app-reporting-climate-action-form",
	templateUrl: "./reporting-climate-action-form.component.html",
	styleUrls: ["./reporting-climate-action-form.component.scss"]
})
export class ReportingClimateActionFormComponent implements OnInit {
	indicator: any = [];
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
		private datePipe: DatePipe,
		private router: Router
	) {
		this.service.currentMitigationAction.subscribe(message => {
			this.mitigationAction = message;
			this.getIndicators();
		});
		this.createForm();
	}

	ngOnInit() {
		if (this.isUpdating) {
			this.service.currentMitigationAction.subscribe(message => {
				this.mitigationAction = message;
				this.createUpdateForm();
			});
		}
	}

	get formArray(): AbstractControl | null {
		return this.form.get("formArray");
	}

	getIndicators() {
		if (this.mitigationAction) {
			if (this.mitigationAction.id) {
				const code = this.mitigationAction.id;
				this.service.getMitigationActionIndicators(code).subscribe(
					context => {
						this.indicator = context;
					},
					error => {
						this.indicator = [];
					}
				);
			}
		}
	}

	buildPayload() {
		const context = {
			monitoring_reporting_indicator: {
				progress_in_monitoring: this.form.value.formArray[0]
					.anyProgressMonitoringRecordedClimateActionsCtrl,
				monitoring_indicator: [
					{
						initial_date_report_period: this.datePipe.transform(
							this.form.value.formArray[1].reportingPeriodStartCtrl,
							"yyyy-MM-dd"
						),

						final_date_report_period: this.datePipe.transform(
							this.form.value.formArray[1].reportingPeriodEndCtrl,
							"yyyy-MM-dd"
						),

						data_updated_date: this.datePipe.transform(
							this.form.value.formArray[1].indicatordataUpdateDateCtrl,
							"yyyy-MM-dd"
						),

						updated_data: this.form.value.formArray[1].informationToUpdateCtrl,
						progress_report: this.form.value.formArray[2]
							.beenProgressActionPeriodCtrl,
						indicator: this.form.value.formArray[1].indicatorSelectionCtrl
					}
				]
			}
		};

		return context;
	}

	submitForm() {
		const context = this.buildPayload();

		this.service
			.submitMitigationActionUpdateForm(context, this.mitigationAction.id)
			.pipe(
				finalize(() => {
					this.form.markAsPristine();
					this.isLoading = false;
				})
			)
			.subscribe(
				response => {
					this.translateService
						.get("Sucessfully submitted form")
						.subscribe((res: string) => {
							this.snackBar.open(res, null, { duration: 3000 });
						});
					this.wasSubmittedSuccessfully = true;
					setTimeout(() => {
						this.router.navigate(["/mitigation/actions"], { replaceUrl: true });
					}, 2000);
				},
				error => {
					this.translateService
						.get("Error submitting form")
						.subscribe((res: string) => {
							this.snackBar.open(res, null, { duration: 3000 });
						});
					this.error = error;
					this.errorComponent.parseErrors(error);
					this.wasSubmittedSuccessfully = false;
				}
			);
	}

	private createUpdateForm() {
		this.form = this.formBuilder.group({
			formArray: this.formBuilder.array([
				this.formBuilder.group({
					anyProgressMonitoringRecordedClimateActionsCtrl: [
						this.mitigationAction.monitoring_reporting_indicator
							.progress_in_monitoring
							? 1
							: 2,
						Validators.required
					]
				}),
				this.formBuilder.group({
					indicatorSelectionCtrl: [
						this.mitigationAction.monitoring_reporting_indicator
							.monitoring_indicator[0].indicator
					],
					indicatorDataUpdateDateCtrl: [
						this.mitigationAction.monitoring_reporting_indicator
							.monitoring_indicator[0].data_updated_date,
						Validators.required
					],
					reportingPeriodStartCtrl: [
						this.mitigationAction.monitoring_reporting_indicator
							.monitoring_indicator[0].initial_date_report_period,
						Validators.required
					],
					reportingPeriodEndCtrl: [
						this.mitigationAction.monitoring_reporting_indicator
							.monitoring_indicator[0].final_date_report_period,
						Validators.required
					],
					informationToUpdateCtrl: [
						this.mitigationAction.monitoring_reporting_indicator
							.monitoring_indicator[0].updated_data,
						Validators.required
					]
				}),

				this.formBuilder.group({
					reportingPeriodCtrl: ["", Validators.required],
					beenProgressActionPeriodCtrl: [
						this.mitigationAction.monitoring_reporting_indicator
							.monitoring_indicator[0].progress_report,
						Validators.required
					]
				})
			])
		});
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
					indicatorSelectionCtrl: [""],
					indicatorDataUpdateDateCtrl: ["", Validators.required],
					reportingPeriodStartCtrl: ["", Validators.required],
					reportingPeriodEndCtrl: ["", Validators.required],
					informationToUpdateCtrl: ["", Validators.required]
				}),

				this.formBuilder.group({
					reportingPeriodCtrl: ["", Validators.required],
					beenProgressActionPeriodCtrl: ["", Validators.required]
				})
			])
		});
	}
}
