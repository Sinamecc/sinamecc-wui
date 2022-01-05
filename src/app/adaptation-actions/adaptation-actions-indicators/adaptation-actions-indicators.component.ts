import { Component, Input, OnInit } from "@angular/core";
import {
	AbstractControl,
	FormBuilder,
	FormGroup,
	Validators
} from "@angular/forms";
import { MatSnackBar } from "@angular/material";

@Component({
	selector: "app-adaptation-actions-indicators",
	templateUrl: "./adaptation-actions-indicators.component.html",
	styleUrls: ["./adaptation-actions-indicators.component.scss"]
})
export class AdaptationActionsIndicatorsComponent implements OnInit {
	form: FormGroup;
	@Input() mainStepper: any;
	durationInSeconds = 3;

	constructor(private formBuilder: FormBuilder, public snackBar: MatSnackBar) {}

	ngOnInit() {
		this.createForm();
	}

	get formArray(): AbstractControl | null {
		return this.form.get("formArray");
	}

	private createForm() {
		this.form = this.formBuilder.group({
			formArray: this.buildRegisterForm()
		});
	}

	buildRegisterForm() {
		return this.formBuilder.array([
			this.formBuilder.group({
				adaptationActionIndicatorNameCtrl: [
					"",
					[Validators.required, Validators.maxLength(100)]
				],
				adaptationActionIndicatorDescriptionCtrl: [
					"",
					[Validators.required, Validators.maxLength(300)]
				],
				adaptationActionIndicatorUnitCtrl: [
					"",
					[Validators.required, Validators.maxLength(50)]
				],
				adaptationActionIndicatorMetodologyCtrl: [
					"",
					[Validators.required, Validators.maxLength(250)]
				],
				adaptationActionIndicatorFrecuenceCtrl: ["", [Validators.required]],
				adaptationActionIndicatorStartDateCtrl: ["", [Validators.required]],
				adaptationActionIndicatorEndDateCtrl: ["", [Validators.required]],
				adaptationActionIndicatorTimeCtrl: ["", [Validators.required]],
				adaptationActionIndicatorCoverageCtrl: ["", [Validators.required]],
				adaptationActionIndicatorDisintegrationCtrl: [
					"",
					[Validators.required, Validators.maxLength(150)]
				],
				adaptationActionIndicatorLimitCtrl: [
					"",
					[Validators.required, Validators.maxLength(500)]
				],
				adaptationActionIndicatorMeasurementCtrl: [
					"",
					[Validators.required, Validators.maxLength(300)]
				],
				adaptationActionIndicatorDetailsCtrl: [
					"",
					[Validators.required, Validators.maxLength(300)]
				]
			}),
			this.formBuilder.group({
				adaptationActionIndicatorResponsibleInstitutionCtrl: [
					"",
					[Validators.required, Validators.maxLength(300)]
				],
				adaptationActionIndicatorSourceTypeCtrl: ["", [Validators.required]],
				adaptationActionIndicatorOperationNameCtrl: [
					"",
					[Validators.required, Validators.maxLength(300)]
				]
			}),
			this.formBuilder.group({
				adaptationActionIndicatorSourceDataCtrl: ["", [Validators.required]],
				adaptationActionIndicatorSourceDataOtherCtrl: [""],
				adaptationActionIndicatorClassifiersCtrl: ["", [Validators.required]],
				adaptationActionIndicatorClassifiersOtherCtrl: [""]
			}),
			this.formBuilder.group({
				adaptationActionIndicatorContactNameCtrl: ["", [Validators.required]],
				adaptationActionIndicatorContactInstitutionCtrl: [
					"",
					[Validators.required]
				],
				adaptationActionIndicatorContactDepartmentCtrl: [
					"",
					[Validators.required]
				],
				adaptationActionIndicatorContactEmailCtrl: [
					"",
					[Validators.required, Validators.email]
				],
				adaptationActionIndicatorContactPhoneCtrl: [
					"",
					[
						Validators.required,
						Validators.maxLength(6),
						Validators.minLength(6)
					]
				]
			})
		]);
	}

	openSnackBar(message: string, action: string = "") {
		this.snackBar.open(message, action, {
			duration: this.durationInSeconds * 1000
		});
	}

	buildPayload() {
		const context = {
			adaptationActionIndicatorNameCtrl: this.form.value.formArray[0]
				.adaptationActionIndicatorNameCtrl,
			adaptationActionIndicatorDescriptionCtrl: this.form.value.formArray[0]
				.adaptationActionIndicatorDescriptionCtrl,
			adaptationActionIndicatorUnitCtrl: this.form.value.formArray[0]
				.adaptationActionIndicatorUnitCtrl,
			adaptationActionIndicatorMetodologyCtrl: this.form.value.formArray[0]
				.adaptationActionIndicatorMetodologyCtrl,
			adaptationActionIndicatorFrecuenceCtrl: this.form.value.formArray[0]
				.adaptationActionIndicatorFrecuenceCtrl,
			adaptationActionIndicatorStartDateCtrl: this.form.value.formArray[0]
				.adaptationActionIndicatorStartDateCtrl,
			adaptationActionIndicatorEndDateCtrl: this.form.value.formArray[0]
				.adaptationActionIndicatorEndDateCtrl,
			adaptationActionIndicatorTimeCtrl: this.form.value.formArray[0]
				.adaptationActionIndicatorTimeCtrl,
			adaptationActionIndicatorCoverageCtrl: this.form.value.formArray[0]
				.adaptationActionIndicatorCoverageCtrl,
			adaptationActionIndicatorDisintegrationCtrl: this.form.value.formArray[0]
				.adaptationActionIndicatorDisintegrationCtrl,
			adaptationActionIndicatorLimitCtrl: this.form.value.formArray[0]
				.adaptationActionIndicatorLimitCtrl,
			adaptationActionIndicatorMeasurementCtrl: this.form.value.formArray[0]
				.adaptationActionIndicatorMeasurementCtrl,
			adaptationActionIndicatorDetailsCtrl: this.form.value.formArray[0]
				.adaptationActionIndicatorDetailsCtrl,

			adaptationActionIndicatorResponsibleInstitutionCtrl: this.form.value
				.formArray[1].adaptationActionIndicatorResponsibleInstitutionCtrl,
			adaptationActionIndicatorSourceTypeCtrl: this.form.value.formArray[1]
				.adaptationActionIndicatorSourceTypeCtrl,
			adaptationActionIndicatorOperationNameCtrl: this.form.value.formArray[1]
				.adaptationActionIndicatorOperationNameCtrl,

			adaptationActionIndicatorSourceDataCtrl: this.form.value.formArray[2]
				.adaptationActionIndicatorSourceDataCtrl,
			adaptationActionIndicatorSourceDataOtherCtrl: this.form.value.formArray[2]
				.adaptationActionIndicatorSourceDataOtherCtrl,
			adaptationActionIndicatorClassifiersCtrl: this.form.value.formArray[2]
				.adaptationActionIndicatorClassifiersCtrl,
			adaptationActionIndicatorClassifiersOtherCtrl: this.form.value
				.formArray[2].adaptationActionIndicatorClassifiersOtherCtrl,

			adaptationActionIndicatorContactNameCtrl: this.form.value.formArray[3]
				.adaptationActionIndicatorContactNameCtrl,
			adaptationActionIndicatorContactInstitutionCtrl: this.form.value
				.formArray[3].adaptationActionIndicatorContactInstitutionCtrl,
			adaptationActionIndicatorContactDepartmentCtrl: this.form.value
				.formArray[3].adaptationActionIndicatorContactDepartmentCtrl,
			adaptationActionIndicatorContactEmailCtrl: this.form.value.formArray[3]
				.adaptationActionIndicatorContactEmailCtrl,
			adaptationActionIndicatorContactPhoneCtrl: this.form.value.formArray[3]
				.adaptationActionIndicatorContactPhoneCtrl
		};
		this.openSnackBar("Formulario creado correctamente", "");
		this.mainStepper.next();
		return context;
	}
}
