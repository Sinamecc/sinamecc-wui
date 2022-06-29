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

  durationInSeconds = 3;
  adaptationAction: AdaptationAction;

  baseYearSlect = 1950;
  lastValidYear = new Date().getFullYear();
  yearsArray = [...Array(this.lastValidYear - this.baseYearSlect).keys()];

  @Input() mainStepper: any;
  @Input() adaptationActionUpdated: AdaptationAction;
  @Input() edit: boolean;

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
      formArray: !this.edit ? this.buildRegisterForm() : this.buildUpdateRegisterForm(),
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
        adaptationActionFinancingDetailInstrumentOtherCtrl: [''],
        adaptationActionFinancingBufgetCtrl: [''],
        adaptationActionFinancingBufgetValueCtrl: ['', Validators.required],
        adaptationActionFinancingBufgetStarDateCtrl: ['', Validators.required],
        adaptationActionFinancingBufgetOtherCtrl: [''],
      }),
      this.formBuilder.group({
        adaptationActionFinancingRegisterMIDEPLANCtrl: [''],
        adaptationActionFinancingRegisterNameMIDEPLANCtrl: [''],
        adaptationActionFinancingRegisterEntityMIDEPLANCtrl: [''],
      }),
    ]);
  }

  buildUpdateRegisterForm() {
    return this.formBuilder.array([
      this.formBuilder.group({
        adaptationActionFinancingStatusCtrl: [this.adaptationActionUpdated.finance.status.code, Validators.required],
        adaptationActionFinancingManagementCtrl: [this.adaptationActionUpdated.finance.administration],
        adaptationActionFinancingSourceDetailCtrl: ['', Validators.required],
        adaptationActionFinancingDetailInstrumentCtrl: [
          this.adaptationActionUpdated.finance.finance_instrument.map((x: any) => parseInt(x.code)),
          Validators.required,
        ],
        adaptationActionFinancingDetailInstrumentOtherCtrl: [''],
        adaptationActionFinancingBufgetCtrl: [''],
        adaptationActionFinancingBufgetValueCtrl: [this.adaptationActionUpdated.finance.budget, Validators.required],
        adaptationActionFinancingBufgetStarDateCtrl: ['', Validators.required],
        adaptationActionFinancingBufgetOtherCtrl: [''],
      }),
      this.formBuilder.group({
        adaptationActionFinancingRegisterMIDEPLANCtrl: [this.adaptationActionUpdated.finance.mideplan.registry],
        adaptationActionFinancingRegisterNameMIDEPLANCtrl: [this.adaptationActionUpdated.finance.mideplan.name],
        adaptationActionFinancingRegisterEntityMIDEPLANCtrl: [this.adaptationActionUpdated.finance.mideplan.entity],
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
        administration: this.form.value.formArray[0].adaptationActionFinancingManagementCtrl
          ? this.form.value.formArray[0].adaptationActionFinancingManagementCtrl
          : null,
        budget: this.form.value.formArray[0].adaptationActionFinancingBufgetValueCtrl,
        status: {
          code: this.form.value.formArray[0].adaptationActionFinancingStatusCtrl,
          name: '-',
        },
        source: this.form.value.formArray[0].adaptationActionFinancingSourceDetailCtrl,
        mideplan: {
          registry: this.form.value.formArray[1].adaptationActionFinancingRegisterMIDEPLANCtrl
            ? this.form.value.formArray[1].adaptationActionFinancingRegisterMIDEPLANCtrl
            : null,
          name: this.form.value.formArray[1].adaptationActionFinancingRegisterNameMIDEPLANCtrl
            ? this.form.value.formArray[1].adaptationActionFinancingRegisterNameMIDEPLANCtrl
            : null,
          entity: this.form.value.formArray[1].adaptationActionFinancingRegisterEntityMIDEPLANCtrl
            ? this.form.value.formArray[1].adaptationActionFinancingRegisterEntityMIDEPLANCtrl
            : null,
        },

        finance_instrument: this.form.value.formArray[0].adaptationActionFinancingDetailInstrumentCtrl,
      },
    };

    return context;
  }

  public selectSourceFinancing(value: number[]) {
    const hasValue = value.includes(3);

    if (hasValue) {
      this.form
        .get('formArray')
        .get([1])
        .get('adaptationActionFinancingRegisterMIDEPLANCtrl')
        .setValidators(Validators.required);
      this.form
        .get('formArray')
        .get([1])
        .get('adaptationActionFinancingRegisterNameMIDEPLANCtrl')
        .setValidators(Validators.required);
      this.form
        .get('formArray')
        .get([1])
        .get('adaptationActionFinancingRegisterEntityMIDEPLANCtrl')
        .setValidators(Validators.required);
    } else {
      this.form.get('formArray').get([1]).get('adaptationActionFinancingRegisterMIDEPLANCtrl').setValidators(null);
      this.form.get('formArray').get([1]).get('adaptationActionFinancingRegisterNameMIDEPLANCtrl').setValidators(null);
      this.form
        .get('formArray')
        .get([1])
        .get('adaptationActionFinancingRegisterEntityMIDEPLANCtrl')
        .setValidators(null);
    }
    this.form.get('formArray').get([1]).get('adaptationActionFinancingRegisterMIDEPLANCtrl').updateValueAndValidity();
    this.form
      .get('formArray')
      .get([1])
      .get('adaptationActionFinancingRegisterNameMIDEPLANCtrl')
      .updateValueAndValidity();
    this.form
      .get('formArray')
      .get([1])
      .get('adaptationActionFinancingRegisterEntityMIDEPLANCtrl')
      .updateValueAndValidity();
  }

  public clickNext(stepper: any, submitForm: boolean) {
    if (!submitForm) {
      this.submitForm();
    } else {
      stepper.next();
    }
  }

  public financeChange(value: number) {
    if (value === 1) {
      this.form
        .get('formArray')
        .get([1])
        .get('adaptationActionFinancingRegisterNameMIDEPLANCtrl')
        .setValidators(Validators.required);
      this.form
        .get('formArray')
        .get([1])
        .get('adaptationActionFinancingRegisterEntityMIDEPLANCtrl')
        .setValidators(Validators.required);
    } else {
      this.form.get('formArray').get([1]).get('adaptationActionFinancingRegisterNameMIDEPLANCtrl').setValidators(null);
      this.form
        .get('formArray')
        .get([1])
        .get('adaptationActionFinancingRegisterEntityMIDEPLANCtrl')
        .setValidators(null);
    }

    this.form
      .get('formArray')
      .get([1])
      .get('adaptationActionFinancingRegisterEntityMIDEPLANCtrl')
      .updateValueAndValidity();

    this.form
      .get('formArray')
      .get([1])
      .get('adaptationActionFinancingRegisterNameMIDEPLANCtrl')
      .updateValueAndValidity();
  }
}
