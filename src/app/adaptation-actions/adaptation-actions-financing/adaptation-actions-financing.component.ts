import { Component, Input, OnInit } from "@angular/core";
import {
	AbstractControl,
	FormBuilder,
	FormGroup,
	Validators
} from "@angular/forms";
import { MatSnackBar } from "@angular/material";

@Component({
	selector: "app-adaptation-actions-financing",
	templateUrl: "./adaptation-actions-financing.component.html",
	styleUrls: ["./adaptation-actions-financing.component.scss"]
})
export class AdaptationActionsFinancingComponent implements OnInit {
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
				adaptationActionFinancingStatusCtrl: ["", Validators.required],
				adaptationActionFinancingManagementCtrl: ["", Validators.required],
				adaptationActionFinancingSourceDetailCtrl: ["", Validators.required],
				adaptationActionFinancingDetailInstrumentCtrl: [
					"",
					Validators.required
				],
				adaptationActionFinancingBufgetCtrl: ["", Validators.required],
				adaptationActionFinancingBufgetValueCtrl: ["", Validators.required],
				adaptationActionFinancingBufgetStarDateCtrl: ["", Validators.required],
				adaptationActionFinancingBufgetOtherCtrl: [""]
			}),
			this.formBuilder.group({
				adaptationActionFinancingRegisterMIDEPLANCtrl: [
					"",
					Validators.required
				],
				adaptationActionFinancingRegisterNameMIDEPLANCtrl: [
					"",
					[Validators.minLength(300)]
				],
				adaptationActionFinancingRegisterEntityMIDEPLANCtrl: [
					"",
					[Validators.required, Validators.minLength(200)]
				]
			})
		]);
	}

	buildPayload() {
		const context = {
			adaptationActionFinancingStatusCtrl: this.form.value.formArray[0]
				.adaptationActionFinancingStatusCtrl,
			adaptationActionFinancingManagementCtrl: this.form.value.formArray[0]
				.adaptationActionFinancingManagementCtrl,
			adaptationActionFinancingSourceDetailCtrl: this.form.value.formArray[0]
				.adaptationActionFinancingSourceDetailCtrl,
			adaptationActionFinancingDetailInstrumentCtrl: this.form.value
				.formArray[0].adaptationActionFinancingDetailInstrumentCtrl,
			adaptationActionFinancingBufgetCtrl: this.form.value.formArray[0]
				.adaptationActionFinancingBufgetCtrl,
			adaptationActionFinancingBufgetValueCtrl: this.form.value.formArray[0]
				.adaptationActionFinancingBufgetValueCtrl,
			adaptationActionFinancingBufgetStarDateCtrl: this.form.value.formArray[0]
				.adaptationActionFinancingBufgetStarDateCtrl,
			adaptationActionFinancingBufgetOtherCtrl: this.form.value.formArray[0]
				.adaptationActionFinancingBufgetOtherCtrl,

			adaptationActionFinancingRegisterMIDEPLANCtrl: this.form.value
				.formArray[1].adaptationActionFinancingRegisterMIDEPLANCtrl,
			adaptationActionFinancingRegisterNameMIDEPLANCtrl: this.form.value
				.formArray[1].adaptationActionFinancingRegisterNameMIDEPLANCtrl,
			adaptationActionFinancingRegisterEntityMIDEPLANCtrl: this.form.value
				.formArray[1].adaptationActionFinancingRegisterEntityMIDEPLANCtrl
		};
		this.openSnackBar("Formulario creado correctamente", "");
		this.mainStepper.next();

		return context;
	}
}
