import { Component, Inject, inject, ViewChild } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { finalize, firstValueFrom, Subject, takeUntil } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorReportingComponent } from '@app/@shared';
import { MAFile } from '@app/mitigation-actions/mitigation-action-file-upload/file-upload';
import { MAEntityType, MAFileType, MitigationAction } from '@app/mitigation-actions/mitigation-action';
import { MitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service';
import { PermissionService } from '@app/@core/permissions.service';
import { States } from '@app/@shared/next-state';

export interface DialogData {
  mitigationAction: MitigationAction;
  report?: string;
  indicator: string;
  state: States;
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
  files: MAFile[] = [];
  newFiles: File[] = [];
  maFileType = MAFileType.MONITORING_UPDATED_DATA;
  entityType = MAEntityType.MONITORING_INDICATOR;
  destroy$ = new Subject<void>();

  constructor(
    private fb: UntypedFormBuilder,
    private datePipe: DatePipe,
    private service: MitigationActionsService,
    private translateService: TranslateService,
    public snackBar: MatSnackBar,
    private permissions: PermissionService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {
    this.buildForm();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get formArray(): AbstractControl | null {
    return this.form.get('formArray');
  }

  private buildForm() {
    const monitoringIndicator = this.data.mitigationAction?.monitoring_reporting_indicator?.monitoring_indicator;
    const canEdit = this.permissions.canEditAcceptedMA(this.data.state);

    const indicator = monitoringIndicator.find((indicator) => indicator.id === this.data.report);

    this.form = this.fb.group({
      formArray: this.fb.array([
        this.fb.group({
          indicatorDataUpdateDateCtrl: [indicator?.data_updated_date ?? '', canEdit ? Validators.required : []],
          reportingPeriodStartCtrl: [indicator?.initial_date_report_period ?? '', canEdit ? Validators.required : []],
          reportingPeriodEndCtrl: [indicator?.final_date_report_period ?? '', canEdit ? Validators.required : []],
          reportTypeCtrl: [parseInt(indicator?.report_type ?? '0'), canEdit ? Validators.required : []],
          informationToUpdateCtrl: [indicator?.updated_data ?? '', canEdit ? Validators.required : []],
        }),
        this.fb.group({
          reportingPeriodCtrl: [indicator?.progress_report_period ?? '', canEdit ? Validators.required : []],
          reportingPeriodUntilCtrl: [indicator?.progress_report_period_until ?? '', canEdit ? Validators.required : []],
          beenProgressActionPeriodCtrl: [indicator?.progress_report ?? '', canEdit ? Validators.required : []],
        }),
      ]),
    });
  }

  submitForm(): void {
    const payload = this.buildPayload();
    this.updateMitigationAction(payload);
  }

  updateMitigationAction(context: any) {
    this.loading = true;
    this.service
      .submitMitigationActionUpdateForm(context, this.data.mitigationAction.id)
      .pipe(
        finalize(() => {
          this.form.markAsPristine();
          this.loading = false;
        }),
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.successSendForm(response.id);
        },
        error: (error) => {
          this.translateService
            .get('Error submitting form')
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: string) => {
              this.snackBar.open(res, null, { duration: 3000 });
            });
          this.error = error;
          this.errorComponent.parseErrors(error);
        },
      });
  }

  successSendForm(id: string) {
    if (this.newFiles.length) {
      this.uploadFiles();
    }

    this.translateService
      .get('specificLabel.sucessfullySubmittedForm')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: string) => {
        this.snackBar.open(res, null, { duration: 3000 });
      });

    this.dialogRef.close();
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
            report_type: this.form.value.formArray[0].reportTypeCtrl,
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

    // TODO fix this when crud is available
    if (this.data.report) {
      context['monitoring_reporting_indicator']['monitoring_indicator'][0]['id'] = this.data.report;
    }

    // const monitoringReporting = this.mitigationAction.monitoring_reporting_indicator['monitoring_indicator'];
    // if (monitoringReporting && monitoringReporting.length > 0) {
    //   if (monitoringReporting[0].id) {
    //     context['monitoring_reporting_indicator']['monitoring_indicator']['id'] = monitoringReporting[0].id;
    //   }
    // }

    return context;
  }

  onFileChange(files: File[]) {
    this.newFiles = files;
  }

  getEntityId() {
    // TODO
    return this.data.report;
  }

  async uploadFiles(): Promise<any> {
    return await firstValueFrom(
      this.service.submitFiles(
        this.data.mitigationAction.id,
        this.maFileType,
        this.newFiles,
        this.data.report,
        this.entityType,
      ),
    );
  }

  getFiles() {
    const monitoringId = this.data.report;
    if (monitoringId) {
      const report = this.data.mitigationAction.monitoring_reporting_indicator.monitoring_indicator.find(
        (indicator) => indicator.id === monitoringId,
      );
      console.log('REPORT', report);
      console.log('REPORT LIST', this.data.mitigationAction.monitoring_reporting_indicator.monitoring_indicator);
      if (report) {
        return report.files;
      }
    }
    return [];
  }
}
