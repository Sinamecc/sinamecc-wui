import { Component, Input, OnInit } from "@angular/core";
import {
	AbstractControl,
	FormBuilder,
	FormGroup,
	Validators
} from "@angular/forms";
import { MatSnackBar } from "@angular/material";

@Component({
	selector: "app-adaptation-actions-report",
	templateUrl: "./adaptation-actions-report.component.html",
	styleUrls: ["./adaptation-actions-report.component.scss"]
})
export class AdaptationActionsReportComponent implements OnInit {
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

	openSnackBar(message: string, action: string = "") {
		this.snackBar.open(message, action, {
			duration: this.durationInSeconds * 1000
		});
	}

	buildRegisterForm() {
		return this.formBuilder.array([
			this.formBuilder.group({
				adaptationActionTypeCtrl: ["", Validators.required],
				adaptationActionNameCtrl: [
					"",
					[Validators.required, Validators.maxLength(250)]
				],
				adaptationActionTargetCtrl: [
					"",
					[Validators.required, Validators.maxLength(3000)]
				],
				adaptationActionDescriptionCtrl: [
					"",
					[Validators.required, Validators.maxLength(3000)]
				],
				adaptationActionGoalCtrl: [
					"",
					[Validators.required, Validators.maxLength(3000)]
				],
				adaptationActionODSCtrl: ["", Validators.required]
			}),
			this.formBuilder.group({
				adaptationActionProvinceCtrl: ["", Validators.required],
				adaptationActionCantonCtrl: ["", Validators.required],
				adaptationActionDistritCtrl: ["", Validators.required],
				adaptationActionDescriptionNarrativeCtrl: [
					"",
					[Validators.required, Validators.maxLength(3000)]
				],
				adaptationActionLocationCtrl: ["", Validators.required]
			}),
			this.formBuilder.group({
				adaptationActionThemeCtrl: ["", Validators.required],
				adaptationActionTypologyCtrl: ["", Validators.required],
				adaptationActionGoalRelationCtrl: ["", Validators.required],
				adaptationActionEjeRelationCtrl: ["", Validators.required],
				adaptationActionLinealRelationCtrl: ["", Validators.required]
			}),
			this.formBuilder.group({
				adaptationActionInstrumentCtrl: ["", [Validators.maxLength(250)]],
				adaptationActionDescriptionInstrumentCtrl: [
					"",
					[Validators.maxLength(3000)]
				]
			}),
			this.formBuilder.group({
				adaptationActionClimateThreatCtrl: ["", Validators.required],
				adaptationActionClimateThreatOtherCtrl: [""],
				adaptationActionInfoSourceCtrl: ["", Validators.required]
			}),
			this.formBuilder.group({
				adaptationActionStartDateCtrl: ["", Validators.required],
				adaptationActionEndDateCtrl: ["", Validators.required],
				adaptationActionDurationTimeCtrl: [
					"",
					[Validators.required, Validators.maxLength(20)]
				],
				adaptationActionEntityCtrl: [
					"",
					[Validators.required, Validators.maxLength(49)]
				],
				adaptationActionEntityOthersCtrl: [
					"",
					[Validators.required, Validators.maxLength(250)]
				],
				adaptationActionCodeCtrl: [
					"CODAA0001",
					[Validators.required, Validators.maxLength(50)]
				]
			})
		]);
	}

	buildPayload() {
		const context = {
			adaptationActionTypeCtrl: this.form.value.formArray[0]
				.adaptationActionTypeCtrl,
			adaptationActionNameCtrl: this.form.value.formArray[0]
				.adaptationActionNameCtrl,
			adaptationActionTargetCtrl: this.form.value.formArray[0]
				.adaptationActionTargetCtrl,
			adaptationActionDescriptionCtrl: this.form.value.formArray[0]
				.adaptationActionDescriptionCtrl,
			adaptationActionGoalCtrl: this.form.value.formArray[0]
				.adaptationActionGoalCtrl,
			adaptationActionODSCtrl: this.form.value.formArray[0]
				.adaptationActionODSCtrl,

			adaptationActionProvinceCtrl: this.form.value.formArray[1]
				.adaptationActionProvinceCtrl,
			adaptationActionCantonCtrl: this.form.value.formArray[1]
				.adaptationActionCantonCtrl,
			adaptationActionDistritCtrl: this.form.value.formArray[1]
				.adaptationActionDistritCtrl,
			adaptationActionDescriptionNarrativeCtrl: this.form.value.formArray[1]
				.adaptationActionDescriptionNarrativeCtrl,
			adaptationActionLocationCtrl: this.form.value.formArray[1]
				.adaptationActionLocationCtrl,

			adaptationActionThemeCtrl: this.form.value.formArray[2]
				.adaptationActionThemeCtrl,
			adaptationActionTypologyCtrl: this.form.value.formArray[2]
				.adaptationActionTypologyCtrl,
			adaptationActionGoalRelationCtrl: this.form.value.formArray[2]
				.adaptationActionGoalRelationCtrl,
			adaptationActionEjeRelationCtrl: this.form.value.formArray[2]
				.adaptationActionEjeRelationCtrl,
			adaptationActionLinealRelationCtrl: this.form.value.formArray[2]
				.adaptationActionLinealRelationCtrl,

			adaptationActionInstrumentCtrl: this.form.value.formArray[3]
				.adaptationActionInstrumentCtrl,
			adaptationActionDescriptionInstrumentCtrl: this.form.value.formArray[3]
				.adaptationActionDescriptionInstrumentCtrl,

			adaptationActionClimateThreatCtrl: this.form.value.formArray[3]
				.adaptationActionClimateThreatCtrl,
			adaptationActionClimateThreatOtherCtrl: this.form.value.formArray[3]
				.adaptationActionClimateThreatOtherCtrl,
			adaptationActionInfoSourceCtrl: this.form.value.formArray[3]
				.adaptationActionInfoSourceCtrl,

			adaptationActionStartDateCtrl: this.form.value.formArray[5]
				.adaptationActionStartDateCtrl,
			adaptationActionEndDateCtrl: this.form.value.formArray[5]
				.adaptationActionEndDateCtrl,
			adaptationActionDurationTimeCtrl: this.form.value.formArray[5]
				.adaptationActionDurationTimeCtrl,
			adaptationActionEntityCtrl: this.form.value.formArray[5]
				.adaptationActionEntityCtrl,
			adaptationActionEntityOthersCtrl: this.form.value.formArray[5]
				.adaptationActionEntityOthersCtrl,
			adaptationActionCodeCtrl: this.form.value.formArray[5]
				.adaptationActionCodeCtrl
		};

		this.openSnackBar("Formulario creado correctamente", "");
		this.mainStepper.next();

		return context;
	}
}
