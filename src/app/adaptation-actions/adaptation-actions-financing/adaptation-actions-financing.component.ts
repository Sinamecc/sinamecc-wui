import { Component, OnInit } from "@angular/core";
import {
	AbstractControl,
	FormBuilder,
	FormGroup,
	Validators
} from "@angular/forms";

@Component({
	selector: "app-adaptation-actions-financing",
	templateUrl: "./adaptation-actions-financing.component.html",
	styleUrls: ["./adaptation-actions-financing.component.scss"]
})
export class AdaptationActionsFinancingComponent implements OnInit {
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
}
