import { Component, OnInit } from "@angular/core";
import {
	AbstractControl,
	FormBuilder,
	FormGroup,
	Validators
} from "@angular/forms";

@Component({
	selector: "app-adaptation-actions-indicators",
	templateUrl: "./adaptation-actions-indicators.component.html",
	styleUrls: ["./adaptation-actions-indicators.component.scss"]
})
export class AdaptationActionsIndicatorsComponent implements OnInit {
	form: FormGroup;

	constructor(private formBuilder: FormBuilder) {}

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
					[Validators.required, Validators.minLength(100)]
				],
				adaptationActionIndicatorDescriptionCtrl: [
					"",
					[Validators.required, Validators.minLength(300)]
				],
				adaptationActionIndicatorUnitCtrl: [
					"",
					[Validators.required, Validators.minLength(50)]
				],
				adaptationActionIndicatorMetodologyCtrl: [
					"",
					[Validators.required, Validators.minLength(250)]
				],
				adaptationActionIndicatorFrecuenceCtrl: ["", [Validators.required]],
				adaptationActionIndicatorStartDateCtrl: ["", [Validators.required]],
				adaptationActionIndicatorEndDateCtrl: ["", [Validators.required]],
				adaptationActionIndicatorTimeCtrl: ["", [Validators.required]],
				adaptationActionIndicatorCoverageCtrl: ["", [Validators.required]],
				adaptationActionIndicatorDisintegrationCtrl: [
					"",
					[Validators.required, Validators.minLength(150)]
				],
				adaptationActionIndicatorLimitCtrl: [
					"",
					[Validators.required, Validators.minLength(500)]
				],
				adaptationActionIndicatorMeasurementCtrl: [
					"",
					[Validators.required, Validators.minLength(300)]
				],
				adaptationActionIndicatorDetailsCtrl: [
					"",
					[Validators.required, Validators.minLength(300)]
				]
			}),
			this.formBuilder.group({
				adaptationActionIndicatorResponsibleInstitutionCtrl: [
					"",
					[Validators.required, Validators.minLength(300)]
				],
				adaptationActionIndicatorSourceTypeCtrl: ["", [Validators.required]],
				adaptationActionIndicatorOperationNameCtrl: [
					"",
					[Validators.required, Validators.minLength(300)]
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
}
