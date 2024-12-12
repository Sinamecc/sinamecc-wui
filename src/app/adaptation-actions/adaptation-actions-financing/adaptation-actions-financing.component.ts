import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AdaptationActionService } from '../adaptation-actions-service';
import { AdaptationAction, InstrumentDetail } from '../interfaces/adaptationAction';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-adaptation-actions-financing',
  templateUrl: './adaptation-actions-financing.component.html',
  styleUrls: ['./adaptation-actions-financing.component.scss'],
  standalone: false,
})
export class AdaptationActionsFinancingComponent implements OnInit {
  form: UntypedFormGroup;

  durationInSeconds = 3;
  adaptationAction: AdaptationAction;

  baseYearSlect = 1950;
  lastValidYear = new Date().getFullYear();
  yearsArray = [...Array(this.lastValidYear - this.baseYearSlect).keys()];
  instrumentDeatils: InstrumentDetail[] = [];

  climateValueSourceComponent: any;
  actualCurrency = 'CRC';

  @Input() mainStepper: any;
  @Input() adaptationActionUpdated: AdaptationAction;
  @Input() edit: boolean;

  constructor(
    private formBuilder: UntypedFormBuilder,
    public snackBar: MatSnackBar,
    private service: AdaptationActionService,
    private translateService: TranslateService,
  ) {
    this.service.currentAdaptationActionSource.subscribe((message) => {
      this.adaptationAction = message;
    });
  }

  ngOnInit() {
    this.loadInstrumentDetail();
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
    const climateValueElements = this.adaptationActionUpdated.finance.source.map((x) => parseInt(x.id));
    const defaultCurrency =
      this.adaptationActionUpdated.finance.currency !== 'USD' &&
      this.adaptationActionUpdated.finance.currency !== 'CRC';
    this.actualCurrency = defaultCurrency ? 'other' : this.adaptationActionUpdated.finance.currency;

    this.climateValueSourceComponent = climateValueElements;
    return this.formBuilder.array([
      this.formBuilder.group({
        adaptationActionFinancingStatusCtrl: [
          this.adaptationActionUpdated.finance.status ? this.adaptationActionUpdated.finance.status.code : '',
          Validators.required,
        ],
        adaptationActionFinancingManagementCtrl: [this.adaptationActionUpdated.finance.administration],
        adaptationActionFinancingSourceDetailCtrl: [climateValueElements, Validators.required],
        adaptationActionFinancingDetailInstrumentCtrl: [
          this.adaptationActionUpdated.finance.finance_instrument.map((x: any) => parseInt(x.code)),
          Validators.required,
        ],
        adaptationActionFinancingDetailInstrumentOtherCtrl: [''],
        adaptationActionFinancingBufgetCtrl: [''],
        adaptationActionFinancingBufgetValueCtrl: [this.adaptationActionUpdated.finance.budget, Validators.required],
        adaptationActionFinancingBufgetStarDateCtrl: [
          parseInt(this.adaptationActionUpdated.finance.year),
          Validators.required,
        ],
        adaptationActionFinancingBufgetOtherCtrl: [
          defaultCurrency ? this.adaptationActionUpdated.finance.currency : '',
        ],
      }),
      this.formBuilder.group({
        adaptationActionFinancingRegisterMIDEPLANCtrl: [
          this.adaptationActionUpdated.finance.mideplan
            ? parseInt(this.adaptationActionUpdated.finance.mideplan.registry)
            : '',
        ],
        adaptationActionFinancingRegisterNameMIDEPLANCtrl: [
          this.adaptationActionUpdated.finance.mideplan ? this.adaptationActionUpdated.finance.mideplan.name : '',
        ],
        adaptationActionFinancingRegisterEntityMIDEPLANCtrl: [
          this.adaptationActionUpdated.finance.mideplan ? this.adaptationActionUpdated.finance.mideplan.entity : '',
        ],
      }),
    ]);
  }

  submitForm() {
    const payload: AdaptationAction = this.buildPayload();
    //this.service.updateCurrentAdaptationAction(Object.assign(this.adaptationAction, payload));
    // this.mainStepper.next();

    this.service.updateNewAdaptationAction(payload, this.adaptationAction.id).subscribe(
      (_) => {
        this.service.updateCurrentAdaptationAction(Object.assign(this.adaptationAction, payload));
        this.translateService.get('specificLabel.saveInformation').subscribe((res: string) => {
          this.snackBar.open(res, null, { duration: 3000 });
          this.mainStepper.next();
        });
      },
      (error) => {
        this.openSnackBar('Error al crear el formulario, intentelo de nuevo más tarde', '');
      },
    );
  }

  buildPayload() {
    const context: AdaptationAction = {
      finance: {
        currency:
          this.actualCurrency === 'other'
            ? this.form.value.formArray[0].adaptationActionFinancingBufgetOtherCtrl
            : this.actualCurrency,
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
        year: this.form.value.formArray[0].adaptationActionFinancingBufgetStarDateCtrl,
        finance_instrument: this.form.value.formArray[0].adaptationActionFinancingDetailInstrumentCtrl,
      },
    };

    return context;
  }

  public changeCurrency(currency: string) {
    this.actualCurrency = currency;
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

  public loadInstrumentDetail() {
    this.service.loadInstrumentDetail().subscribe((response) => {
      this.instrumentDeatils = response;
    });
  }
}
