import { Component, Input, OnInit } from "@angular/core";
import {
	AbstractControl,
	FormBuilder,
	FormGroup,
	Validators
} from "@angular/forms";
import { MatSnackBar } from "@angular/material";

@Component({
	selector: "app-adaptation-actions-climate-monitoring",
	templateUrl: "./adaptation-actions-climate-monitoring.component.html",
	styleUrls: ["./adaptation-actions-climate-monitoring.component.scss"]
})
export class AdaptationActionsClimateMonitoringComponent implements OnInit {
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
				actionStatusCorrespondingReportingPeriodCtrl: ["", Validators.required],
				progressMonitoringRecordedClimateActionsCtrl: ["", Validators.required]
			}),
			this.formBuilder.group({
				reportPeriodStartCtrl: ["", Validators.required],
				reportPeriodEndtCtrl: ["", Validators.required],
				indicatorDataUpdateDateCtrl: ["", Validators.required],
				indicatorVerificationSourceCtrl: ["", Validators.required],
				indicatorVerificationSourceOtherCtrl: ["", Validators.required],
				attachSupportingInformationCtrl: ["", Validators.required]
			}),
			this.formBuilder.group({
				reportPeriodStartCtrl: ["", Validators.required],
				reportPeriodEndtCtrl: ["", Validators.required],
				advanceDescriptionCtrl: [
					"",
					[Validators.required, Validators.maxLength(3000)]
				]
			})
		]);
	}

	buildPayload() {
		this.openSnackBar("Formulario creado correctamente", "");
		this.mainStepper.next();
	}
}
