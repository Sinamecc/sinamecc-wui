import { Component, OnInit, ElementRef, ViewChild, EventEmitter, Output, Input} from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray, AbstractControl, FormControl } from '@angular/forms';
import { finalize, tap } from 'rxjs/operators';
import { environment } from '@env/environment';
import { Logger, I18nService, AuthenticationService } from '@app/core';
import { MitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { MitigationActionNewFormData } from '@app/mitigation-actions/mitigation-action-new-form-data';
import { MitigationAction } from '../mitigation-action';
import {MomentDateAdapter} from '@angular/material-moment-adapter';

import * as _moment from 'moment';

const moment = _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LLL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

const log = new Logger('MitigationAction');

@Component({
  selector: 'app-key-aspects-form',
  templateUrl: './key-aspects-form.component.html',
  styleUrls: ['./key-aspects-form.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class KeyAspectsFormComponent implements OnInit {

  version: string = environment.version;
  error: string;
  form: FormGroup;
  displayFinancialSource:  boolean;
  isLoading = false;
  wasSubmittedSuccessfully = false;

  mitigationAction: MitigationAction;

  @Input() newFormData: Observable<MitigationActionNewFormData>;
  @Input() processedNewFormData: MitigationActionNewFormData;
  @Input() isUpdating: boolean;

  get formArray(): AbstractControl | null { return this.form.get('formArray'); }

  constructor(private formBuilder: FormBuilder,
    private i18nService: I18nService,
    private authenticationService: AuthenticationService,
    private service: MitigationActionsService,
    private translateService: TranslateService,
    public snackBar: MatSnackBar) {
      // this.formData = new FormData();
      this.service.currentMitigationAction.subscribe(message => this.mitigationAction = message);
      this.createForm();
      this.displayFinancialSource = false;
}

ngOnInit() {
  if (this.isUpdating) {
    this.service.currentMitigationAction.subscribe(message => {
      this.mitigationAction = message;
      this.updateFormData();
    });
  }
}

  private createForm() {
    this.form = this.formBuilder.group({
      formArray: this.formBuilder.array([
        this.formBuilder.group({
          actionObjectiveCtrl: ['', Validators.required],
          actionStatusCtrl: ['', Validators.required],
          implementationInitialDateCtrl: ['', Validators.required],
          implementationEndDateCtrl: ['', Validators.required],
        }),
        this.formBuilder.group({
          geographicScaleCtrl: ['', Validators.required],
        }),
        this.formBuilder.group({
          locationNameCtrl: ['', Validators.required],
          gisAnnexedCtrl: ['0', Validators.required],
        }),
        this.formBuilder.group({
          financingStatusCtrl: ['', Validators.required],
          financingSourceCtrl: [''],
          gasInventoryCtrl: ['0'],
        }),
      ])
    });

  }

  private updateFormData() {
    this.form = this.formBuilder.group({
      formArray: this.formBuilder.array([
        this.formBuilder.group({
          actionObjectiveCtrl: [this.mitigationAction.purpose, Validators.required],
          actionStatusCtrl: [this.mitigationAction.status.id, Validators.required],
          implementationInitialDateCtrl: [this.mitigationAction.start_date, Validators.required],
          implementationEndDateCtrl: [this.mitigationAction.end_date, Validators.required],
        }),
        this.formBuilder.group({
          geographicScaleCtrl: [this.mitigationAction.geographic_scale.id, Validators.required],
        }),
        this.formBuilder.group({
          locationNameCtrl: [this.mitigationAction.location.geographical_site, Validators.required],
          gisAnnexedCtrl: [String(+this.mitigationAction.location.is_gis_annexed), Validators.required],
        }),
        this.formBuilder.group({
          financingStatusCtrl: [this.mitigationAction.finance.status.id, Validators.required],
          financingSourceCtrl: [this.mitigationAction.finance.source],
          gasInventoryCtrl: [this.mitigationAction.gas_inventory],
        }),
      ])
    });

    this.isLoading = false;
    // this.initiativeTypes = [{ id: 1, name: 'Proyect' }, { id: 2, name: 'Law' }, { id: 3, name: 'Goal' }];
  }

  submitForm() {
    this.isLoading = true;
    let startDate = '';
    let endDate = '';
    if (this.isUpdating) {
      startDate = this.form.value.formArray[0].implementationInitialDateCtrl;
      endDate = this.form.value.formArray[0].implementationEndDateCtrl;
    } else {
      startDate = this.form.value.formArray[0].implementationInitialDateCtrl.format('YYYY-MM-DD');
      endDate = this.form.value.formArray[0].implementationEndDateCtrl.format('YYYY-MM-DD');
    }
    const context = {
      purpose: this.form.value.formArray[0].actionObjectiveCtrl,
      status: this.form.value.formArray[0].actionStatusCtrl,
      start_date: startDate,
      end_date: endDate,
      finance: {
        status: this.form.value.formArray[3].financingStatusCtrl,
        source: this.form.value.formArray[3].financingSourceCtrl },
      gas_inventory: this.form.value.formArray[3].gasInventoryCtrl,
      geographic_scale: this.form.value.formArray[1].geographicScaleCtrl,
      location: {
        geographical_site: this.form.value.formArray[2].locationNameCtrl,
        is_gis_annexed: this.form.value.formArray[2].gisAnnexedCtrl,
      },
      user: String(this.authenticationService.credentials.id),
      registration_type: this.processedNewFormData.registration_types[0].id
    };

    if (this.isUpdating) {
      context.finance['id'] = this.mitigationAction.finance.id;
      context.location['id'] = this.mitigationAction.location.id;
      // context['update_existing_mitigation_action'] = true;
    }
    this.service.submitMitigationActionUpdateForm(context, this.mitigationAction.id, this.i18nService.language.split('-')[0])
    .pipe(finalize(() => {
      this.form.markAsPristine();
      this.isLoading = false;
    }))
    .subscribe(response => {
      this.translateService.get('Sucessfully submitted form').subscribe((res: string) => { this.snackBar.open(res, null, {duration: 3000 }); });
      this.wasSubmittedSuccessfully = true;
    }, error => {
      this.translateService.get('Error submitting form').subscribe((res: string) => { this.snackBar.open(res, null, { duration: 3000 }); });
      log.debug(`New Mitigation Action Form error: ${error}`);
      this.error = error;
      this.wasSubmittedSuccessfully = false;
    });

  }

  financialSourceInputShown($event: any) {
    // todo: when we traslate in the backend we need to traslate this hardcoded value here
    const insuredSourceTypeId = this.processedNewFormData.finance_status
      .filter(financeSource => financeSource.status === 'Asegurado' || financeSource.status === 'Insured')
        .map(({ id }) => id);
    this.displayFinancialSource = $event.value == insuredSourceTypeId;
  }


}
