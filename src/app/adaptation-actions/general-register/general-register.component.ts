import { Component, OnInit } from "@angular/core";
import {
	AbstractControl,
	FormBuilder,
	FormGroup,
	Validators
} from "@angular/forms";

@Component({
	selector: "app-general-register",
	templateUrl: "./general-register.component.html",
	styleUrls: ["./general-register.component.scss"]
})
export class GeneralRegisterComponent implements OnInit {
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
}
