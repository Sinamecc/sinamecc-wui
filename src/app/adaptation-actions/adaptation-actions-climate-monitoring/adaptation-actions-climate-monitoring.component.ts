import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdaptationActionService } from '../adaptation-actions-service';
import { AdaptationAction } from '../interfaces/adaptationAction';

@Component({
  selector: 'app-adaptation-actions-climate-monitoring',
  templateUrl: './adaptation-actions-climate-monitoring.component.html',
  styleUrls: ['./adaptation-actions-climate-monitoring.component.scss'],
})
export class AdaptationActionsClimateMonitoringComponent implements OnInit {
  form: FormGroup;
  adaptationAction: AdaptationAction;
  @Input() mainStepper: any;
  durationInSeconds = 3;

  constructor(
    private formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
    private datePipe: DatePipe,
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
        actionStatusCorrespondingReportingPeriodCtrl: ['', Validators.required],
        progressMonitoringRecordedClimateActionsCtrl: ['', Validators.required],
      }),
      this.formBuilder.group({
        reportPeriodStartCtrl: ['', Validators.required],
        reportPeriodEndtCtrl: ['', Validators.required],
        indicatorDataUpdateDateCtrl: ['', Validators.required],
        indicatorVerificationSourceCtrl: ['', Validators.required],
        indicatorVerificationSourceOtherCtrl: [''],
        attachSupportingInformationCtrl: ['', Validators.required],
      }),
      this.formBuilder.group({
        reportPeriodStart2Ctrl: ['', Validators.required],
        reportPeriodEndt2Ctrl: ['', Validators.required],
        advanceDescriptionCtrl: ['', [Validators.required, Validators.maxLength(3000)]],
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
    const context = {
      progress_log: {
        action_status: this.form.value.formArray[0].actionStatusCorrespondingReportingPeriodCtrl,
        progress_monitoring: this.form.value.formArray[0].progressMonitoringRecordedClimateActionsCtrl,
      },
      indicator_monitoring: {
        start_date: this.datePipe.transform(this.form.value.formArray[1].reportPeriodStartCtrl, 'yyyy-MM-dd'),
        end_date: this.datePipe.transform(this.form.value.formArray[1].reportPeriodEndtCtrl, 'yyyy-MM-dd'),
        update_date: this.datePipe.transform(this.form.value.formArray[1].indicatorDataUpdateDateCtrl, 'yyyy-MM-dd'),
        data_to_update: '-',
        indicator_source: [this.form.value.formArray[1].indicatorVerificationSourceCtrl],
      },
    };

    return context;
  }
}
