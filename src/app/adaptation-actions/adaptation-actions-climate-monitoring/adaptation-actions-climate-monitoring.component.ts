import { I } from '@angular/cdk/keycodes';
import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AdaptationActionService } from '../adaptation-actions-service';
import { AdaptationAction } from '../interfaces/adaptationAction';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-adaptation-actions-climate-monitoring',
  templateUrl: './adaptation-actions-climate-monitoring.component.html',
  styleUrls: ['./adaptation-actions-climate-monitoring.component.scss'],
})
export class AdaptationActionsClimateMonitoringComponent implements OnInit {
  form: UntypedFormGroup;
  adaptationAction: AdaptationAction;
  @Input() mainStepper: any;
  @Input() adaptationActionUpdated: AdaptationAction;
  @Input() edit: boolean;
  attachSupportMonitoringFile: any;
  durationInSeconds = 3;

  constructor(
    private formBuilder: UntypedFormBuilder,
    public snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private service: AdaptationActionService,
    private router: Router,
    private translateService: TranslateService
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

  buildUpdateRegisterForm() {
    return this.formBuilder.array([
      this.formBuilder.group({
        actionStatusCorrespondingReportingPeriodCtrl: [
          this.adaptationActionUpdated.progress_log.action_status,
          Validators.required,
        ],
        progressMonitoringRecordedClimateActionsCtrl: [
          parseInt(this.adaptationActionUpdated.progress_log.progress_monitoring),
          Validators.required,
        ],
      }),
      this.formBuilder.group({
        indicatorCtrl: this.formBuilder.array(
          this.updatedIndicatorCtrl(this.adaptationActionUpdated.indicator_monitoring_list)
        ),
      }),

      this.formBuilder.group({
        advanceDescriptionCtrl: [
          this.adaptationActionUpdated.general_report.description,
          [Validators.required, Validators.maxLength(3000)],
        ],
      }),
    ]);
  }

  removeIndicatorCtrl(index: number) {
    const control = <UntypedFormArray>this.form.controls.formArray['controls'][1].controls['indicatorCtrl'];
    control.removeAt(index);
  }

  addIndicatorCtrl(index: number) {
    const control = <UntypedFormArray>this.form.controls.formArray['controls'][1].controls['indicatorCtrl'].controls;
    control.push(this.indicatorCtrl());
  }

  updatedIndicatorCtrl(indicatorMonitoringList: any[]) {
    const indicatorList = [];
    this.attachSupportMonitoringFile = 'file';

    for (const indicator of indicatorMonitoringList) {
      const indicatorDataUpdateDate = new Date(indicator.update_date);
      const reportPeriodEnd = new Date(indicator.end_date);
      const reportPeriodStart = new Date(indicator.start_date);

      indicatorDataUpdateDate.setMinutes(
        indicatorDataUpdateDate.getMinutes() + indicatorDataUpdateDate.getTimezoneOffset()
      );

      reportPeriodEnd.setMinutes(reportPeriodEnd.getMinutes() + reportPeriodEnd.getTimezoneOffset());

      reportPeriodStart.setMinutes(reportPeriodStart.getMinutes() + reportPeriodStart.getTimezoneOffset());

      const form = this.formBuilder.group({
        id: [indicator.id],
        indicatorsCtrl: [indicator.indicator.id, Validators.required],
        reportPeriodStartCtrl: [reportPeriodStart, Validators.required],
        reportPeriodEndtCtrl: [reportPeriodEnd, Validators.required],
        dataWantUpdateCtrl: [indicator.data_to_update, Validators.required],
        indicatorDataUpdateDateCtrl: [indicatorDataUpdateDate, Validators.required],
        indicatorVerificationSourceCtrl: [
          indicator.indicator_source.map((x: { id: any }) => x.id),
          Validators.required,
        ],
        indicatorVerificationSourceOtherCtrl: [''],
        attachSupportingInformationCtrl: [indicator.support_information, Validators.required],
      });
      indicatorList.push(form);
    }
    return indicatorList;
  }

  indicatorCtrl() {
    return this.formBuilder.group({
      indicatorsCtrl: ['', Validators.required],
      reportPeriodStartCtrl: ['', Validators.required],
      reportPeriodEndtCtrl: ['', Validators.required],
      dataWantUpdateCtrl: ['', Validators.required],
      indicatorDataUpdateDateCtrl: ['', Validators.required],
      indicatorVerificationSourceCtrl: ['', Validators.required],
      indicatorVerificationSourceOtherCtrl: [''],
      attachSupportingInformationCtrl: ['', Validators.required],
    });
  }

  buildRegisterForm() {
    return this.formBuilder.array([
      this.formBuilder.group({
        actionStatusCorrespondingReportingPeriodCtrl: ['', Validators.required],
        progressMonitoringRecordedClimateActionsCtrl: ['', Validators.required],
      }),
      this.formBuilder.group({
        indicatorCtrl: this.formBuilder.array([this.indicatorCtrl()]),
      }),
      this.formBuilder.group({
        advanceDescriptionCtrl: ['', [Validators.required, Validators.maxLength(3000)]],
      }),
    ]);
  }

  submitForm() {
    // here que need to call the EP
    const payload: AdaptationAction = this.buildPayload();

    this.service.updateCurrentAdaptationAction(Object.assign(this.adaptationAction, payload));
    this.service.updateNewAdaptationAction(payload, this.adaptationAction.id).subscribe(
      (_) => {
        this.mainStepper.next();
        this.translateService.get('specificLabel.saveInformation').subscribe((res: string) => {
          this.snackBar.open(res, null, { duration: 3000 });
        });
      },
      (error) => {
        this.openSnackBar('Error al crear el formulario, intentelo de nuevo más tarde', '');
      }
    );
  }

  sendForm() {
    const payload: any = this.buildPayload();
    this.service.updateCurrentAdaptationAction(Object.assign(this.adaptationAction, payload));
    this.service.updateNewAdaptationAction(payload, this.adaptationAction.id).subscribe(
      (_) => {
        this.openSnackBar('Formulario creado correctamente', '');
        this.router.navigate([`/adaptation/actions`], {
          replaceUrl: true,
        });
      },
      (error) => {
        this.openSnackBar('Error al crear el formulario, intentelo de nuevo más tarde', '');
      }
    );
  }

  clickNext(stteper: any, value: number, monitoringAdvance: string) {
    if (parseInt(monitoringAdvance) === 1) {
      this.sendForm();
    } else {
      if (parseInt(monitoringAdvance) === 3) {
        this.submitForm();
      } else {
        if (value === 1) {
          this.setGeneralReportFiels(true);
          stteper.next();
        } else {
          this.sendForm();
        }
      }
    }
  }

  buildPayload() {
    const indicatorMonitoringList = [];
    const isEmptyList = !(
      this.form.value.formArray[0].actionStatusCorrespondingReportingPeriodCtrl === '2' &&
      this.form.value.formArray[0].progressMonitoringRecordedClimateActionsCtrl === 1
    );

    for (const form of this.form.controls.formArray['controls'][1].controls['indicatorCtrl'].controls) {
      const indicatorMonitoringElement = {
        indicator: form.value.indicatorsCtrl,
        start_date: form.value.reportPeriodStartCtrl
          ? this.datePipe.transform(form.value.reportPeriodStartCtrl, 'yyyy-MM-dd')
          : null,
        end_date: form.value.reportPeriodEndtCtrl
          ? this.datePipe.transform(form.value.reportPeriodEndtCtrl, 'yyyy-MM-dd')
          : null,
        update_date: form.value.indicatorDataUpdateDateCtrl
          ? this.datePipe.transform(form.value.indicatorDataUpdateDateCtrl, 'yyyy-MM-dd')
          : null,
        data_to_update: form.value.dataWantUpdateCtrl ? form.value.dataWantUpdateCtrl : null,
        indicator_source: form.value.indicatorVerificationSourceCtrl ? form.value.indicatorVerificationSourceCtrl : [],
        support_information: form.value.attachSupportingInformationCtrl,
      };
      if (form.value.id) {
        indicatorMonitoringElement['id'] = form.value.id;
      }
      indicatorMonitoringList.push(indicatorMonitoringElement);
    }

    const context = {
      progress_log: {
        action_status: this.form.value.formArray[0].actionStatusCorrespondingReportingPeriodCtrl,
        progress_monitoring: this.form.value.formArray[0].progressMonitoringRecordedClimateActionsCtrl
          ? this.form.value.formArray[0].progressMonitoringRecordedClimateActionsCtrl
          : null,
      },
      indicator_monitoring_list: isEmptyList ? [] : indicatorMonitoringList,
      general_report: {
        start_date: this.form.value.formArray[2].reportPeriodStart2Ctrl
          ? this.datePipe.transform(this.form.value.formArray[2].reportPeriodStart2Ctrl, 'yyyy-MM-dd')
          : null,
        end_date: this.form.value.formArray[2].reportPeriodEndt2Ctrl
          ? this.datePipe.transform(this.form.value.formArray[2].reportPeriodEndt2Ctrl, 'yyyy-MM-dd')
          : null,
        description: this.form.value.formArray[2].advanceDescriptionCtrl
          ? this.form.value.formArray[2].advanceDescriptionCtrl
          : null,
      },
    };

    return context;
  }

  setGeneralReportFiels(validations: boolean) {
    if (validations) {
      this.form
        .get('formArray')
        .get([2])
        .get('advanceDescriptionCtrl')
        .setValidators([Validators.required, Validators.maxLength(3000)]);

      for (let i = 0; i < this.form.controls.formArray['controls'][1].controls['indicatorCtrl'].controls.length; i++) {
        this.form
          .get('formArray')
          .get([1])
          .get('indicatorCtrl')
          .get([i])
          .get('indicatorsCtrl')
          .setValidators(Validators.required);

        this.form
          .get('formArray')
          .get([1])
          .get('indicatorCtrl')
          .get([i])
          .get('reportPeriodStartCtrl')
          .setValidators(Validators.required);

        this.form
          .get('formArray')
          .get([1])
          .get('indicatorCtrl')
          .get([i])
          .get('reportPeriodEndtCtrl')
          .setValidators(Validators.required);

        this.form
          .get('formArray')
          .get([1])
          .get('indicatorCtrl')
          .get([i])
          .get('dataWantUpdateCtrl')
          .setValidators(Validators.required);

        this.form
          .get('formArray')
          .get([1])
          .get('indicatorCtrl')
          .get([i])
          .get('indicatorDataUpdateDateCtrl')
          .setValidators(Validators.required);

        this.form
          .get('formArray')
          .get([1])
          .get('indicatorCtrl')
          .get([i])
          .get('indicatorVerificationSourceCtrl')
          .setValidators(Validators.required);
      }
    } else {
      this.form.get('formArray').get([2]).get('advanceDescriptionCtrl').setValidators(null);

      for (let i = 0; i < this.form.controls.formArray['controls'][1].controls['indicatorCtrl'].controls.length; i++) {
        this.form.get('formArray').get([1]).get('indicatorCtrl').get([i]).get('indicatorsCtrl').setValidators(null);

        this.form
          .get('formArray')
          .get([1])
          .get('indicatorCtrl')
          .get([i])
          .get('reportPeriodStartCtrl')
          .setValidators(null);

        this.form
          .get('formArray')
          .get([1])
          .get('indicatorCtrl')
          .get([i])
          .get('reportPeriodEndtCtrl')
          .setValidators(null);

        this.form.get('formArray').get([1]).get('indicatorCtrl').get([i]).get('dataWantUpdateCtrl').setValidators(null);

        this.form
          .get('formArray')
          .get([1])
          .get('indicatorCtrl')
          .get([i])
          .get('indicatorDataUpdateDateCtrl')
          .setValidators(null);

        this.form
          .get('formArray')
          .get([1])
          .get('indicatorCtrl')
          .get([i])
          .get('indicatorVerificationSourceCtrl')
          .setValidators(null);
      }
    }

    this.form.get('formArray').get([2]).get('advanceDescriptionCtrl').updateValueAndValidity();

    for (let i = 0; i < this.form.controls.formArray['controls'][1].controls['indicatorCtrl'].controls.length; i++) {
      this.form.get('formArray').get([1]).get('indicatorCtrl').get([i]).get('indicatorsCtrl').updateValueAndValidity();

      this.form
        .get('formArray')
        .get([1])
        .get('indicatorCtrl')
        .get([i])
        .get('reportPeriodStartCtrl')
        .updateValueAndValidity();

      this.form
        .get('formArray')
        .get([1])
        .get('indicatorCtrl')
        .get([i])
        .get('reportPeriodEndtCtrl')
        .updateValueAndValidity();

      this.form
        .get('formArray')
        .get([1])
        .get('indicatorCtrl')
        .get([i])
        .get('dataWantUpdateCtrl')
        .updateValueAndValidity();

      this.form
        .get('formArray')
        .get([1])
        .get('indicatorCtrl')
        .get([i])
        .get('indicatorDataUpdateDateCtrl')
        .updateValueAndValidity();

      this.form
        .get('formArray')
        .get([1])
        .get('indicatorCtrl')
        .get([i])
        .get('indicatorVerificationSourceCtrl')
        .updateValueAndValidity();
    }
  }

  setIndicatorMonitoringFields(validations: boolean) {
    if (validations) {
      this.form.get('formArray').get([1]).get('indicatorsCtrl').setValidators(Validators.required);

      this.form.get('formArray').get([1]).get('reportPeriodStartCtrl').setValidators(Validators.required);

      this.form.get('formArray').get([1]).get('reportPeriodEndtCtrl').setValidators(Validators.required);

      this.form.get('formArray').get([1]).get('indicatorDataUpdateDateCtrl').setValidators(Validators.required);

      this.form.get('formArray').get([1]).get('indicatorVerificationSourceCtrl').setValidators(Validators.required);

      this.form.get('formArray').get([1]).get('attachSupportingInformationCtrl').setValidators(Validators.required);
    } else {
      this.form.get('formArray').get([1]).get('indicatorsCtrl').setValidators(null);

      this.form.get('formArray').get([1]).get('reportPeriodStartCtrl').setValidators(null);

      this.form.get('formArray').get([1]).get('reportPeriodEndtCtrl').setValidators(null);

      this.form.get('formArray').get([1]).get('indicatorDataUpdateDateCtrl').setValidators(null);

      this.form.get('formArray').get([1]).get('indicatorVerificationSourceCtrl').setValidators(null);

      this.form.get('formArray').get([1]).get('attachSupportingInformationCtrl').setValidators(null);
    }

    this.form.get('formArray').get([1]).get('indicatorsCtrl').updateValueAndValidity();

    this.form.get('formArray').get([1]).get('reportPeriodStartCtrl').updateValueAndValidity();

    this.form.get('formArray').get([1]).get('reportPeriodEndtCtrl').updateValueAndValidity();

    this.form.get('formArray').get([1]).get('indicatorDataUpdateDateCtrl').updateValueAndValidity();

    this.form.get('formArray').get([1]).get('indicatorVerificationSourceCtrl').updateValueAndValidity();

    //this.form.get('formArray').get([1]).get('attachSupportingInformationCtrl').updateValueAndValidity();
  }

  changeMonitoring(id: string) {
    if (parseInt(id) === 1) {
      this.setGeneralReportFiels(true);
      this.setIndicatorMonitoringFields(true);
    } else {
      this.setGeneralReportFiels(false);
      this.setIndicatorMonitoringFields(false);
    }
  }

  actionStatusChange(value: string) {
    if (value === '3' || value === '1') {
      this.form.get('formArray').get([0]).get('progressMonitoringRecordedClimateActionsCtrl').setValidators(null);
      this.form.get('formArray').get([0]).get('progressMonitoringRecordedClimateActionsCtrl').setValue(2);
      this.setGeneralReportFiels(false);
    } else {
      this.form
        .get('formArray')
        .get([0])
        .get('progressMonitoringRecordedClimateActionsCtrl')
        .setValidators(Validators.required);

      this.form.get('formArray').get([0]).get('progressMonitoringRecordedClimateActionsCtrl').setValue('');
    }
    this.form.get('formArray').get([0]).get('progressMonitoringRecordedClimateActionsCtrl').updateValueAndValidity();
  }

  uploadFile(event: any) {
    this.attachSupportMonitoringFile = event;
  }
}
