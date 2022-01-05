import { Component, OnInit } from "@angular/core";
import {
	AbstractControl,
	FormBuilder,
	FormGroup,
	Validators
} from "@angular/forms";
import { MatSnackBar } from "@angular/material";

@Component({
	selector: "app-adaptation-actions-action-impact",
	templateUrl: "./adaptation-actions-action-impact.component.html",
	styleUrls: ["./adaptation-actions-action-impact.component.scss"]
})
export class AdaptationActionsActionImpactComponent implements OnInit {
	form: FormGroup;
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
				generalImpactCtrl: ["", Validators.required],
				adaptationTemporalityImpactCtrl: ["", Validators.required],
				impactsAccordingIndicatorsCtrl: [""],
				genderEquityElementsCtrl: ["", Validators.required],
				genderEquityElementsQuestionCtrl: ["", Validators.required],
				actionNegativeImpactCtrl: ["", Validators.required],
				AnnexSupportingInformationCtrl: ["", Validators.required]
			})
		]);
	}

	openSnackBar(message: string, action: string = "") {
		this.snackBar.open(message, action, {
			duration: this.durationInSeconds * 1000
		});
	}

	buildPayload() {
		this.openSnackBar("Formulario creado correctamente", "");
	}
}
