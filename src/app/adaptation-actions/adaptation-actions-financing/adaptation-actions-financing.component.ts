import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdaptationActionService } from '../adaptation-actions-service';
import { AdaptationAction } from '../interfaces/adaptationAction';

@Component({
  selector: 'app-adaptation-actions-financing',
  templateUrl: './adaptation-actions-financing.component.html',
  styleUrls: ['./adaptation-actions-financing.component.scss'],
})
export class AdaptationActionsFinancingComponent implements OnInit {
  form: FormGroup;
  @Input() mainStepper: any;
  durationInSeconds = 3;
  adaptationAction: AdaptationAction;

  constructor(
    private formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    private service: AdaptationActionService
  ) {
    this.service.currentAdaptationActionSource.subscribe((message) => {
      this.adaptationAction = message;
    });
  }

  ngOnInit() {
    this.createForm();
  }

  get formArray(): AbstractControl | null {
    return this.form.get('formArray');
  }

  private createForm() {
    this.form = this.formBuilder.group({
      formArray: this.buildRegisterForm(),
    });
  }

  openSnackBar(message: string, action: string = '') {
    this.snackBar.open(message, action, {
      duration: this.durationInSeconds * 1000,
    });
  }

  buildRegisterForm() {
    return this.formBuilder.array([
      this.formBuilder.group({
        adaptationActionFinancingStatusCtrl: ['', Validators.required],
        adaptationActionFinancingManagementCtrl: [''],
        adaptationActionFinancingSourceDetailCtrl: ['', Validators.required],
        adaptationActionFinancingDetailInstrumentCtrl: ['', Validators.required],
        adaptationActionFinancingDetailInstrumentOtherCtrl: [''], // new field
        adaptationActionFinancingBufgetCtrl: [''],
        adaptationActionFinancingBufgetValueCtrl: ['', Validators.required],
        adaptationActionFinancingBufgetStarDateCtrl: ['', Validators.required],
        adaptationActionFinancingBufgetOtherCtrl: [''],
      }),
      this.formBuilder.group({
        adaptationActionFinancingRegisterMIDEPLANCtrl: ['', Validators.required],
        adaptationActionFinancingRegisterNameMIDEPLANCtrl: ['', [Validators.maxLength(300)]],
        adaptationActionFinancingRegisterEntityMIDEPLANCtrl: ['', [Validators.required, Validators.maxLength(200)]],
      }),
    ]);
  }

  submitForm() {
    const payload: AdaptationAction = this.buildPayload();

    this.service.updateCurrentAdaptationAction(Object.assign(this.adaptationAction, payload));

    this.mainStepper.next();
    /*
		this.service
			.updateNewAdaptationAction(payload, this.adaptationAction.id)
			.subscribe(_ => {
				this.openSnackBar("Formulario creado correctamente", "");
				this.mainStepper.next();
			});

			*/
  }

  buildPayload() {
    const context: AdaptationAction = {
      finance: {
        administration: this.form.value.formArray[0].adaptationActionFinancingManagementCtrl,
        budget: this.form.value.formArray[0].adaptationActionFinancingBufgetValueCtrl,
        status: {
          code: this.form.value.formArray[0].adaptationActionFinancingStatusCtrl,
          name: '-',
        },
        mideplan: {
          registry: this.form.value.formArray[1].adaptationActionFinancingRegisterMIDEPLANCtrl,
          name: this.form.value.formArray[1].adaptationActionFinancingRegisterNameMIDEPLANCtrl,
          entity: this.form.value.formArray[1].adaptationActionFinancingRegisterEntityMIDEPLANCtrl,
        },
        source: [1, 2],
        finance_instrument: this.form.value.formArray[0].adaptationActionFinancingDetailInstrumentCtrl,
      },
    };

    return context;
  }
}
