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
import {
	MitigationActionNewFormData,
	IngeiCompliance
} from "@app/mitigation-actions/mitigation-action-new-form-data";
import { MitigationAction } from "../mitigation-action";
import { ErrorReportingComponent } from "@app/shared/error-reporting/error-reporting.component";

const log = new Logger("MitigationAction");
@Component({
	selector: "app-emissions-mitigation-form",
	templateUrl: "./emissions-mitigation-form.component.html",
	styleUrls: ["./emissions-mitigation-form.component.scss"]
})
export class EmissionsMitigationFormComponent implements OnInit {
	version: string = environment.version;
	error: string;
	form: FormGroup;
	@Input() newFormData: Observable<MitigationActionNewFormData>;
	@Input() processedNewFormData: MitigationActionNewFormData;
	@Input() isUpdating: boolean;
	isLoading = false;
	wasSubmittedSuccessfully = false;

	mitigationAction: MitigationAction;
	@ViewChild("errorComponent") errorComponent: ErrorReportingComponent;

	get formArray(): AbstractControl | null {
		return this.form.get("formArray");
	}

	constructor(
		private formBuilder: FormBuilder,
		private i18nService: I18nService,
		private service: MitigationActionsService,
		private translateService: TranslateService,
		private authenticationService: AuthenticationService,
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
					exAnteEmissionReductionsCtrl: ["", Validators.required],
					periodPotentialEmissionReductionEstimatedCtrl: [
						"",
						Validators.required
					],
					isourcesEmissionsGasesCoveredCtrl: ["", Validators.required],
					carbonSinksReservoirsCtrl: ["", Validators.required],
					definitionBaselineCtrl: ["", Validators.required],
					methodologyExantePotentialReductionEmissionsCO2Ctrl: [
						"",
						Validators.required
					],
					documentationCalculationsEstimateReductionEmissionsCO2Ctrl: [
						"",
						Validators.required
					],
					isCurrentlyReflectedInventoryCtrl: ["", Validators.required]
				}),
				this.formBuilder.group({
					standardizedCalculationMethodologyUsedCtrl: [""],
					standardizedCalculationMethodologyUsedDetailCtrl: [
						"",
						Validators.required
					],
					calculationsDocumentedCtrl: [""],
					calculationsDocumentedDetailCtrl: ["", Validators.required],
					emissionFactorsUsedCalculationDocumentedCtrl: [""],
					emissionFactorsUsedCalculationDocumentedDetailCtrl: [
						"",
						Validators.required
					],
					assumptionsDocumentedCtrl: [""],
					assumptionsDocumentedDetailCtrl: ["", Validators.required]
				}),
				this.formBuilder.group({
					intendParticipateInternationalCarbonMarketsCtrl: [
						"",
						Validators.required
					],
					mechanismStandardApplyCtrl: ["", Validators.required],
					methodologyUsedCtrl: ["", Validators.required]
				})
			])
		});
	}

	private updateFormData() {
		this.form = this.formBuilder.group({
			formArray: this.formBuilder.array([
				this.formBuilder.group({
					ingeiComplianceCtrl: [
						this.mitigationAction["ingei_compliances"].map(
							(elem: any) => elem.id
						),
						Validators.required
					]
				}),
				this.formBuilder.group({
					emissionSourceCtrl: [
						this.mitigationAction.emissions_source,
						Validators.required
					],
					carbonSinksCtrl: [
						this.mitigationAction.carbon_sinks,
						Validators.required
					]
				})
			])
		});

		this.isLoading = false;
		// this.initiativeTypes = [{ id: 1, name: 'Proyect' }, { id: 2, name: 'Law' }, { id: 3, name: 'Goal' }];
	}

	buildPayload() {
		const payload = {
			impact_documentation: {
				estimate_reduction_co2: this.form.value.formArray[0]
					.exAnteEmissionReductionsCtrl,
				period_potential_reduction: this.form.value.formArray[0]
					.periodPotentialEmissionReductionEstimatedCtrl,
				base_line_definition: this.form.value.formArray[0]
					.definitionBaselineCtrl,
				calculation_methodology: this.form.value.formArray[0]
					.methodologyExantePotentialReductionEmissionsCO2Ctrl,
				estimate_calculation_documentation: this.form.value.formArray[0]
					.documentationCalculationsEstimateReductionEmissionsCO2Ctrl,
				mitigation_action_in_inventory:
					this.form.value.formArray[0].isCurrentlyReflectedInventoryCtrl === 1
						? true
						: false,

				carbon_international_commerce: this.form.value.formArray[2]
					.intendParticipateInternationalCarbonMarketsCtrl,
				methodologies_to_use: this.form.value.formArray[2].methodologyUsedCtrl,
				question: [
					{
						code: "Q1",
						question: "mitigationAction.standardizedCalculationMethodologyUsed",
						check:
							this.form.value.formArray[1]
								.standardizedCalculationMethodologyUsedCtrl === "1"
								? true
								: false,
						detail: this.form.value.formArray[1]
							.standardizedCalculationMethodologyUsedDetailCtrl
					},
					{
						code: "Q2",
						question: "mitigationAction.calculationsDocumented",
						check:
							this.form.value.formArray[1].calculationsDocumentedCtrl === "1"
								? true
								: false,
						detail: this.form.value.formArray[1]
							.calculationsDocumentedDetailCtrl
					},
					{
						code: "Q3",
						question:
							"mitigationAction.emissionFactorsUsedCalculationDocumented",
						check:
							this.form.value.formArray[1]
								.emissionFactorsUsedCalculationDocumentedCtrl === "1"
								? true
								: false,
						detail: this.form.value.formArray[1]
							.emissionFactorsUsedCalculationDocumentedDetailCtrl
					},
					{
						code: "Q4",
						question: "mitigationAction.assumptionsDocumented",
						check:
							this.form.value.formArray[1].assumptionsDocumentedCtrl === "1"
								? true
								: false,
						detail: this.form.value.formArray[1].assumptionsDocumentedDetailCtrl
					}
				]
			}
		};

		return payload;
	}

	submitForm() {
		this.isLoading = true;
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
