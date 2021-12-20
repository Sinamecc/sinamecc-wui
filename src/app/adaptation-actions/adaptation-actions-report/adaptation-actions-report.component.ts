import { Component, OnInit } from "@angular/core";
import {
	AbstractControl,
	FormBuilder,
	FormGroup,
	Validators
} from "@angular/forms";

@Component({
	selector: "app-adaptation-actions-report",
	templateUrl: "./adaptation-actions-report.component.html",
	styleUrls: ["./adaptation-actions-report.component.scss"]
})
export class AdaptationActionsReportComponent implements OnInit {
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
}
