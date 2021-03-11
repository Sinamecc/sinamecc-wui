import {
	Component,
	OnInit,
	ElementRef,
	ViewChild,
	EventEmitter,
	Output,
	Input
} from "@angular/core";
import {
	FormGroup,
	FormBuilder,
	Validators,
	AbstractControl
} from "@angular/forms";
import { finalize } from "rxjs/operators";
import { environment } from "@env/environment";
import { Logger, I18nService, AuthenticationService } from "@app/core";
import { MitigationActionsService } from "@app/mitigation-actions/mitigation-actions.service";
import { MitigationActionNewFormData } from "@app/mitigation-actions/mitigation-action-new-form-data";

import { TranslateService } from "@ngx-translate/core";
import { MatSnackBar } from "@angular/material";
import { Observable } from "rxjs/Observable";
import { MitigationAction } from "../mitigation-action";
import { ErrorReportingComponent } from "@app/shared/error-reporting/error-reporting.component";

const log = new Logger("MitigationAction");

@Component({
	selector: "app-basic-information-form",
	templateUrl: "./basic-information-form.component.html",
	styleUrls: ["./basic-information-form.component.scss"]
})
export class BasicInformationFormComponent implements OnInit {
	version: string = environment.version;
	error: string;
	form: FormGroup;
	isLoading = false;
	wasSubmittedSuccessfully = false;
	mitigationAction: MitigationAction;

	@Input() newFormData: Observable<MitigationActionNewFormData>;
	@Input() processedNewFormData: MitigationActionNewFormData;
	@Input() isUpdating: boolean;
	@ViewChild("errorComponent") errorComponent: ErrorReportingComponent;

	get formArray(): AbstractControl | null {
		return this.form.get("formArray");
	}

	constructor(
		private formBuilder: FormBuilder,
		private i18nService: I18nService,
		private authenticationService: AuthenticationService,
		private service: MitigationActionsService,
		private translateService: TranslateService,
		public snackBar: MatSnackBar
	) {
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
			formArray: this.formBuilder.array([
				this.formBuilder.group({
					programCtrl: ["", Validators.required],
					stepsTakingToFinancingCtrl: ["", Validators.required],
					detailfinancingSourceCtrl: ["", Validators.required],
					financingSourceApplyingCtrl: ["", Validators.required],
					mitigationActionBudgetCtrl: ["", Validators.required],
					referenceYearCtrl: ["", Validators.required]
				}),
				this.formBuilder.group({
					registeredNonReimbursableCooperationMideplanCtrl: [
						"",
						Validators.required
					],
					entityProjectCtrl: ["", Validators.required]
				})
			])
		});
	}

	private updateFormData() {
		this.form = this.formBuilder.group({
			formArray: this.formBuilder.array([
				this.formBuilder.group({
					programCtrl: [
						this.mitigationAction.strategy_name,
						Validators.required
					],
					nameCtrl: [this.mitigationAction.name, Validators.required],
					entityCtrl: [
						this.mitigationAction.institution.id,
						Validators.required
					]
				}),
				this.formBuilder.group({
					contactNameCtrl: [
						this.mitigationAction.contact.full_name,
						Validators.required
					],
					positionCtrl: [
						this.mitigationAction.contact.job_title,
						Validators.required
					],
					emailFormCtrl: [
						this.mitigationAction.contact.email,
						Validators.email
					],
					phoneCtrl: [
						this.mitigationAction.contact.phone,
						Validators.compose([Validators.required, Validators.minLength(8)])
					]
				})
			])
		});

		this.isLoading = false;
	}

	submitForm() {
		this.isLoading = true;

		const context = {
			contact: {
				full_name: this.form.value.formArray[1].contactNameCtrl,
				job_title: this.form.value.formArray[1].positionCtrl,
				email: this.form.value.formArray[1].emailFormCtrl,
				phone: this.form.value.formArray[1].phoneCtrl
			},
			strategy_name: this.form.value.formArray[0].programCtrl,
			name: this.form.value.formArray[0].nameCtrl,
			institution: this.form.value.formArray[0].entityCtrl,
			user: String(this.authenticationService.credentials.id),
			registration_type: this.processedNewFormData.registration_types[0].id
		};
		if (this.isUpdating) {
			context.contact["id"] = this.mitigationAction.contact.id;
		}
		this.service
			.submitMitigationActionUpdateForm(
				context,
				this.mitigationAction.id,
				this.i18nService.language.split("-")[0]
			)
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
					this.errorComponent.parseErrors(error);
					this.error = error;
					this.wasSubmittedSuccessfully = false;
				}
			);
	}
}
