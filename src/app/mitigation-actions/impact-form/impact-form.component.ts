import {
	Component,
	OnInit,
	ElementRef,
	ViewChild,
	EventEmitter,
	Output,
	Input
} from "@angular/core";
import { Router } from "@angular/router";
import {
	FormGroup,
	FormBuilder,
	Validators,
	FormArray,
	AbstractControl
} from "@angular/forms";
import { finalize, tap } from "rxjs/operators";
import { environment } from "@env/environment";
import { Logger, I18nService, AuthenticationService } from "@app/core";
import { MitigationActionsService } from "@app/mitigation-actions/mitigation-actions.service";
import { TranslateService } from "@ngx-translate/core";
import { MatSnackBar } from "@angular/material";
import { Observable } from "rxjs/Observable";
import { MitigationActionNewFormData } from "@app/mitigation-actions/mitigation-action-new-form-data";
import { MitigationAction } from "../mitigation-action";
import { ErrorReportingComponent } from "@app/shared/error-reporting/error-reporting.component";
import { DatePipe } from "@angular/common";

const log = new Logger("MitigationAction");

@Component({
	selector: "app-impact-form",
	templateUrl: "./impact-form.component.html",
	styleUrls: ["./impact-form.component.scss"]
})
export class ImpactFormComponent implements OnInit {
	version: string = environment.version;
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

	get formArray(): AbstractControl | null {
		return this.form.get("formArray");
	}

	getFormObject(key: string) {
		return this.form.get(key);
	}

	getFormKeys() {
		return Object.keys(this.form.controls);
	}

	constructor(
		private formBuilder: FormBuilder,
		private i18nService: I18nService,
		private service: MitigationActionsService,
		private authenticationService: AuthenticationService,
		private translateService: TranslateService,
		private router: Router,
		public snackBar: MatSnackBar,
		private datePipe: DatePipe
	) {
		// this.formData = new FormData();
		this.service.currentMitigationAction.subscribe(
			message => (this.mitigationAction = message)
		);
		this.createForm();
	}

	ngOnInit() {
		if (this.isUpdating) {
			this.service.currentMitigationAction.subscribe(message => {
				this.mitigationAction = message;
				this.updateFormData();
			});
		}
	}

	private createForm() {
		this.form = this.formBuilder.group({
			formArray: this.buildForm()
		});
	}

	addNewForm() {
		const index = Object.keys(this.form.controls).length + 1;
		this.form.controls["formArray" + index] = this.buildForm();
	}

	removeForm(key: string) {
		delete this.form.controls[key];
	}

	buildForm() {
		return this.formBuilder.array([
			this.formBuilder.group({
				howSustainabilityIndicatorCtrl: ["", Validators.required],
				indicatorNameCtrl: ["", Validators.required],
				indicatorDescriptionCtrl: ["", Validators.required],
				indicatorUnitCtrl: ["", Validators.required],
				methodologicalDetailIndicatorCtrl: ["", Validators.required],
				indicatorReportingPeriodicityOtherCtrl: [""],
				indicatorReportingPeriodicityCtrl: ["", Validators.required],
				timeSeriesAvailableStartCtrl: ["", Validators.required],
				timeSeriesAvailableEndCtrl: ["", Validators.required],
				geographicCoverageCtrl: ["", Validators.required],
				geographicCoverageOtherCtrl: [""],
				disintegrationCtrl: ["", Validators.required],
				dataSourceCtrl: ["", Validators.required],
				observationsCommentsCtrl: ["", Validators.required]
			}),
			this.formBuilder.group({
				responsibleInstitutionCtrl: ["", Validators.required],
				sourceTypeCtrl: ["", Validators.required],
				sourceTypeOtherCtrl: [""],
				statisticalOperationNameCtrl: ["", Validators.required]
			}),
			this.formBuilder.group({
				datatypeCtrl: ["", Validators.required],
				datatypeOtherCtrl: [""],
				sinameccClassifiersCtrl: ["", Validators.required],
				sinameccClassifiersOtherCtrl: [""]
			}),
			this.formBuilder.group({
				namePersonResponsibleCtrl: ["", Validators.required],
				institutionCtrl: ["", Validators.required],
				contactPersonTitleCtrl: ["", Validators.required],
				emailAddressCtrl: ["", Validators.email],
				phoneCtrl: [
					"",
					Validators.compose([Validators.required, Validators.minLength(8)])
				]
			}),
			this.formBuilder.group({
				dateLastUpdateCtrl: ["", Validators.required],
				changesLastupdateCtrl: ["", Validators.required],
				descriptionChangesCtrl: ["", Validators.required],
				authorLastUpdateCtrl: ["", Validators.required]
			})
		]);
	}

	buildUpdateForm(indicator: Object) {
		return this.formBuilder.array([
			this.formBuilder.group({
				howSustainabilityIndicatorCtrl: ["", Validators.required],
				indicatorNameCtrl: [indicator["name"], Validators.required],
				indicatorDescriptionCtrl: [indicator["unit"], Validators.required],
				indicatorUnitCtrl: [indicator["unit"], Validators.required],
				methodologicalDetailIndicatorCtrl: [
					indicator["methodological_detail"],
					Validators.required
				],
				indicatorReportingPeriodicityOtherCtrl: [""],
				indicatorReportingPeriodicityCtrl: [
					indicator["reporting_periodicity"],
					Validators.required
				],
				timeSeriesAvailableStartCtrl: [
					indicator["available_time_start_date"],
					Validators.required
				],
				timeSeriesAvailableEndCtrl: [
					indicator["available_time_end_date"],
					Validators.required
				],
				geographicCoverageCtrl: [
					indicator["geographic_coverage"],
					Validators.required
				],
				geographicCoverageOtherCtrl: [indicator["other_geographic_coverage"]],
				disintegrationCtrl: [indicator["disaggregation"], Validators.required],
				dataSourceCtrl: [indicator["limitation"], Validators.required],
				observationsCommentsCtrl: [indicator["comments"], Validators.required]
			}),
			this.formBuilder.group({
				responsibleInstitutionCtrl: [
					indicator["information_source"]["responsible_institution"],
					Validators.required
				],
				sourceTypeCtrl: [
					indicator["information_source"]["type"],
					Validators.required
				],
				sourceTypeOtherCtrl: [indicator["information_source"]["other_type"]],
				statisticalOperationNameCtrl: [
					indicator["information_source"]["statistical_operation"],
					Validators.required
				]
			}),
			this.formBuilder.group({
				datatypeCtrl: [indicator["type_of_data"], Validators.required],
				datatypeOtherCtrl: [indicator["other_type_of_data"]],
				sinameccClassifiersCtrl: [indicator["classifier"], Validators.required],
				sinameccClassifiersOtherCtrl: [indicator["other_classifier"]]
			}),
			this.formBuilder.group({
				namePersonResponsibleCtrl: [
					indicator["contact"]["full_name"],
					Validators.required
				],
				institutionCtrl: [
					indicator["contact"]["institution"],
					Validators.required
				],
				contactPersonTitleCtrl: [
					indicator["contact"]["job_title"],
					Validators.required
				],
				emailAddressCtrl: [indicator["contact"]["email"], Validators.email],
				phoneCtrl: [
					indicator["contact"]["phone"],
					Validators.compose([Validators.required, Validators.minLength(8)])
				]
			}),
			this.formBuilder.group({
				dateLastUpdateCtrl: [
					indicator["change_log"][0]["update_date"],
					Validators.required
				],
				changesLastupdateCtrl: [
					indicator["change_log"][0]["changes"],
					Validators.required
				],
				descriptionChangesCtrl: [
					indicator["change_log"][0]["changes_description"],
					Validators.required
				],
				authorLastUpdateCtrl: [
					indicator["change_log"][0]["author"],
					Validators.required
				]
			})
		]);
	}

	private updateFormData() {
		this.form = this.formBuilder.group({
			formArray: this.buildUpdateForm(
				this.mitigationAction.monitoring_information.indicator[0]
			)
		});
		if (this.mitigationAction.monitoring_information.indicator.length > 1) {
			const elementList = this.mitigationAction.monitoring_information
				.indicator;
			elementList.shift();
			let index = 1;
			for (const element of elementList) {
				this.form.controls["formArray" + index] = this.buildUpdateForm(element);
				index += 1;
			}
		}
		this.isLoading = false;
		// this.initiativeTypes = [{ id: 1, name: 'Proyect' }, { id: 2, name: 'Law' }, { id: 3, name: 'Goal' }];
	}

	buildPayload() {
		const list: any = [];
		for (const element of Object.keys(this.form.controls)) {
			const actualForm = this.form.get(element).value;
			const context = {
				name: actualForm[0].indicatorNameCtrl,
				description: actualForm[0].indicatorDescriptionCtrl,
				unit: actualForm[0].indicatorUnitCtrl,
				methodological_detail: actualForm[0].methodologicalDetailIndicatorCtrl,
				reporting_periodicity: actualForm[0].indicatorReportingPeriodicityCtrl,
				available_time_start_date: this.datePipe.transform(
					actualForm[0].timeSeriesAvailableStartCtrl,
					"yyyy-MM-dd"
				),
				available_time_end_date: this.datePipe.transform(
					actualForm[0].timeSeriesAvailableEndCtrl,
					"yyyy-MM-dd"
				),
				geographic_coverage: actualForm[0].geographicCoverageCtrl,
				other_geographic_coverage: actualForm[0].geographicCoverageOtherCtrl,
				disaggregation: actualForm[0].disintegrationCtrl,
				limitation: actualForm[0].dataSourceCtrl,
				comments: actualForm[0].observationsCommentsCtrl,
				information_source: {
					responsible_institution: actualForm[1].responsibleInstitutionCtrl,
					type: actualForm[1].sourceTypeCtrl,
					other_type: actualForm[1].sourceTypeOtherCtrl,
					statistical_operation: actualForm[1].statisticalOperationNameCtrl
				},
				type_of_data: actualForm[2].datatypeCtrl,
				other_type_of_data: actualForm[2].datatypeOtherCtrl,
				classifier: [actualForm[2].sinameccClassifiersCtrl],
				other_classifier: actualForm[2].sinameccClassifiersOtherCtrl,
				contact: {
					institution: actualForm[3].institutionCtrl,
					full_name: actualForm[3].namePersonResponsibleCtrl,
					job_title: actualForm[3].contactPersonTitleCtrl,
					email: actualForm[3].emailAddressCtrl,
					phone: actualForm[3].phoneCtrl
				},
				change_log: {
					update_date: this.datePipe.transform(
						actualForm[4].dateLastUpdateCtrl,
						"yyyy-MM-dd"
					),
					changes: actualForm[4].changesLastupdateCtrl,
					changes_description: actualForm[4].descriptionChangesCtrl,
					author: actualForm[4].authorLastUpdateCtrl
				}
			};
			list.push(context);
		}

		const payload = {
			monitoring_information: {
				code: "code", // this is requiered for BE, hardcode var
				indicator: list
			}
		};

		return payload;
	}

	submitForm() {
		this.isLoading = true;
		const context = this.buildPayload();
		/*
		if (this.isUpdating) {
			context["update_existing_mitigation_action"] = true;
		} else {
			context["update_new_mitigation_action"] = true;
		}
		*/

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
				},
				error => {
					this.translateService
						.get("Error submitting form")
						.subscribe((res: string) => {
							this.snackBar.open(res, null, { duration: 3000 });
						});
					log.debug(`New Mitigation Action Form error: ${error}`);
					this.error = error;
					this.errorComponent.parseErrors(error);
					this.wasSubmittedSuccessfully = false;
				}
			);
	}
}
