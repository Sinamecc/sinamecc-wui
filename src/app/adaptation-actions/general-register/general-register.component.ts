import { Component, Input, OnInit } from "@angular/core";
import {
	AbstractControl,
	FormBuilder,
	FormGroup,
	Validators
} from "@angular/forms";
import { MatSnackBar } from "@angular/material";

@Component({
	selector: "app-general-register",
	templateUrl: "./general-register.component.html",
	styleUrls: ["./general-register.component.scss"]
})
export class GeneralRegisterComponent implements OnInit {
	form: FormGroup;
	@Input() adaptationActionForm: any;
	@Input() mainStepper: any;

	durationInSeconds = 5;

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
				reportingEntityTypeCtrl: ["", Validators.required],
				entityResponsibleReportingCtrl: [
					"",
					[Validators.required, Validators.maxLength(250)]
				],
				legalIdentificationCtrl: [
					"",
					[Validators.required, Validators.maxLength(10)]
				],
				reportPreparationDateCtrl: ["", Validators.required],
				nameContactPersonCtrl: [
					"",
					[Validators.required, Validators.maxLength(250)]
				],
				titleResponsibleReportingCtrl: [
					"",
					[Validators.required, Validators.maxLength(250)]
				],
				emailCtrl: ["", [Validators.required, Validators.email]],
				phoneCtrl: [
					"",
					[
						Validators.required,
						Validators.minLength(8),
						Validators.maxLength(8)
					]
				],
				entityAddress: ["", [Validators.required, Validators.maxLength(250)]]
			})
		]);
	}

	buildPayload() {
		const context = {
			reportingEntityTypeCtrl: this.form.value.formArray[0]
				.reportingEntityTypeCtrl,
			entityResponsibleReportingCtrl: this.form.value.formArray[0]
				.entityResponsibleReportingCtrl,
			legalIdentificationCtrl: this.form.value.formArray[0]
				.legalIdentificationCtrl,
			reportPreparationDateCtrl: this.form.value.formArray[0]
				.reportPreparationDateCtrl,
			nameContactPersonCtrl: this.form.value.formArray[0].nameContactPersonCtrl,
			titleResponsibleReportingCtrl: this.form.value.formArray[0]
				.titleResponsibleReportingCtrl,
			emailCtrl: this.form.value.formArray[0].emailCtrl,
			phoneCtrl: this.form.value.formArray[0].phoneCtrl,
			entityAddress: this.form.value.formArray[0].entityAddress
		};

		this.adaptationActionForm["form1"] = context;
		this.openSnackBar("Formulario creado correctamente", "");
		this.mainStepper.next();
		return context;
	}
}
