import { Component, Inject, inject, ViewChild } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MAFile, MitigationAction } from '../mitigation-action';
import { DatePipe } from '@angular/common';
import { MitigationActionsService } from '../mitigation-actions.service';
import { finalize } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorReportingComponent } from '@app/@shared';

export interface DialogData {
  mitigationAction: MitigationAction;
  report: string;
  indicator: string;
}

@Component({
  selector: 'app-reporting-climate-action-form',
  templateUrl: './reporting-climate-action-form.component.html',
  styleUrls: ['./reporting-climate-action-form.component.scss'],
  standalone: false,
})
export class ReportingClimateActionFormComponent {
  readonly dialogRef = inject(MatDialogRef<ReportingClimateActionFormComponent>);
  @ViewChild('errorComponent') errorComponent: ErrorReportingComponent;
  error: string;
  form: UntypedFormGroup;
  loading: boolean = false;
  file: MAFile = {
    file: null,
    name: '',
  };

  constructor(
    private fb: UntypedFormBuilder,
    private datePipe: DatePipe,
    private service: MitigationActionsService,
    private translateService: TranslateService,
    public snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {
    if (data.report) {
      this.loadFormData();
    } else {
      this.createForm();
    }
  }

  get formArray(): AbstractControl | null {
    return this.form.get('formArray');
  }

  private createForm() {
    this.form = this.fb.group({
      formArray: this.fb.array([
        this.fb.group({
          indicatorDataUpdateDateCtrl: ['', Validators.required],
          reportingPeriodStartCtrl: ['', Validators.required],
          reportingPeriodEndCtrl: ['', Validators.required],
          reportTypeCtrl: ['', Validators.required],
          informationToUpdateCtrl: ['', Validators.required],
        }),

        this.fb.group({
          reportingPeriodCtrl: ['', Validators.required],
          reportingPeriodUntilCtrl: ['', Validators.required],
          beenProgressActionPeriodCtrl: ['', Validators.required],
        }),
      ]),
    });
  }

  private loadFormData() {
    const monitoring_indicator = this.data.mitigationAction.monitoring_reporting_indicator.monitoring_indicator;
    if (monitoring_indicator && monitoring_indicator.length > 0) {
      this.form = this.fb.group({
        formArray: this.fb.array([
          this.fb.group({
            indicatorDataUpdateDateCtrl: [
              monitoring_indicator ? monitoring_indicator[0].data_updated_date : '',
              Validators.required,
            ],
            reportingPeriodStartCtrl: [
              monitoring_indicator ? monitoring_indicator[0].initial_date_report_period : '',
              Validators.required,
            ],
            reportingPeriodEndCtrl: [
              monitoring_indicator ? monitoring_indicator[0].final_date_report_period : '',
              Validators.required,
            ],
            reportTypeCtrl: [
              parseInt(monitoring_indicator ? monitoring_indicator[0].report_type : '0'),
              Validators.required,
            ],
            informationToUpdateCtrl: [
              monitoring_indicator ? monitoring_indicator[0].updated_data : '',
              Validators.required,
            ],
          }),
          this.fb.group({
            reportingPeriodCtrl: [
              monitoring_indicator ? monitoring_indicator[0].progress_report_period : '',
              Validators.required,
            ],
            reportingPeriodUntilCtrl: [
              monitoring_indicator ? monitoring_indicator[0].progress_report_period_until : '',
              Validators.required,
            ],
            beenProgressActionPeriodCtrl: [
              monitoring_indicator ? monitoring_indicator[0].progress_report : '',
              Validators.required,
            ],
          }),
        ]),
      });
    }
  }

  submitForm(): void {
    const payload = this.buildPayload();
    this.updateMitigationAction(payload);
  }

  updateMitigationAction(context: any) {
    this.service
      .submitMitigationActionUpdateForm(context, this.data.mitigationAction.id)
      .pipe(
        finalize(() => {
          this.form.markAsPristine();
          this.loading = false;
        }),
      )
      .subscribe(
        (response) => {
          this.successSendForm(response.id);
        },
        (error) => {
          this.translateService.get('Error submitting form').subscribe((res: string) => {
            this.snackBar.open(res, null, { duration: 3000 });
          });
          this.error = error;
          this.errorComponent.parseErrors(error);
        },
      );
  }

  successSendForm(id: string) {
    if (this.file.file) {
      this.submitFile(id, this.file.name, this.file.file);
    }

    this.translateService.get('specificLabel.sucessfullySubmittedForm').subscribe((res: string) => {
      this.snackBar.open(res, null, { duration: 3000 });
    });

    this.dialogRef.close();
  }

  async submitFile(id: string, key: string, file: File) {
    await this.service.submitMitigationFile(key, file, id).toPromise();
  }

  buildPayload() {
    const context = {
      monitoring_reporting_indicator: {
        progress_in_monitoring: true,
        monitoring_indicator: [
          {
            data_updated_date: this.datePipe.transform(
              this.form.value.formArray[0].indicatorDataUpdateDateCtrl,
              'yyyy-MM-dd',
            ),
            initial_date_report_period: this.datePipe.transform(
              this.form.value.formArray[0].reportingPeriodStartCtrl,
              'yyyy-MM-dd',
            ),
            final_date_report_period: this.datePipe.transform(
              this.form.value.formArray[0].reportingPeriodEndCtrl,
              'yyyy-MM-dd',
            ),
            report_type: this.form.value.formArray[1].reportTypeCtrl,
            progress_report_period: this.datePipe.transform(
              this.form.value.formArray[1].reportingPeriodCtrl,
              'yyyy-MM-dd',
            ),
            progress_report_period_until: this.datePipe.transform(
              this.form.value.formArray[1].reportingPeriodUntilCtrl,
              'yyyy-MM-dd',
            ),
            updated_data: this.form.value.formArray[0].informationToUpdateCtrl || null,
            progress_report: this.form.value.formArray[1].beenProgressActionPeriodCtrl || null,
            indicator: this.data.indicator,
          },
        ],
      },
    };

    // if (this.mitigationAction.next_state[0].state === this.stateLabel) {
    //   context['is_complete'] = true;
    // }
    // const monitoringReporting = this.mitigationAction.monitoring_reporting_indicator['monitoring_indicator'];
    // if (monitoringReporting && monitoringReporting.length > 0) {
    //   if (monitoringReporting[0].id) {
    //     context['monitoring_reporting_indicator']['monitoring_indicator']['id'] = monitoringReporting[0].id;
    //   }
    // }

    return context;
  }

  uploadFile(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;
    const name = element.name;
    if (fileList) {
      this.file = {
        file: fileList[0],
        name: name,
      };
    }
  }
}
