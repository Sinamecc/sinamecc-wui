import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ErrorReportingComponent } from '@shared';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { MAEntityType, MAFileType, MitigationAction } from '../mitigation-action';
import { MitigationActionNewFormData } from '../mitigation-action-new-form-data';
import { MitigationActionsService } from '../mitigation-actions.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileUpload } from '@app/@shared/upload-button/file-upload';
import { MAFile } from '../mitigation-action-file-upload/file-upload';

@Component({
  selector: 'app-reporting-climate-action-form',
  templateUrl: './reporting-climate-action-form.component.html',
  styleUrls: ['./reporting-climate-action-form.component.scss'],
  standalone: false,
})
export class ReportingClimateActionFormComponent implements OnInit {
  indicator: any = [];
  error: string;
  form: UntypedFormGroup;
  isLoading = false;
  fileLoading = false;
  wasSubmittedSuccessfully = false;
  mitigationAction: MitigationAction;
  stateLabel = 'submitted';
  newFiles: File[] = [];
  files: MAFile[] = [];

  maFileType = MAFileType.MONITORING_UPDATED_DATA;
  entityType = MAEntityType.MONITORING_INDICATOR;
  @Input() newFormData: Observable<MitigationActionNewFormData>;
  @Input() processedNewFormData: MitigationActionNewFormData;
  @Input() isUpdating: boolean;
  @Input() action: string;

  @Input() mitigationActionToUpdate?: any;
  @ViewChild('errorComponent') errorComponent: ErrorReportingComponent;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private service: MitigationActionsService,
    private translateService: TranslateService,
    public snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private router: Router,
  ) {
    this.service.currentMitigationAction.subscribe((message) => {
      this.mitigationAction = message;
    });
    this.isUpdating = this.action === 'update';
    this.createForm();
  }

  ngOnInit() {
    if (!this.isUpdating) {
      this.openStartMessages();
    }

    if (this.isUpdating) {
      this.service.currentMitigationAction.subscribe((message) => {
        this.mitigationAction = message;
        this.updateFormData();
        this.files = this.getFiles();
      });
    }
  }

  get formArray(): AbstractControl | null {
    return this.form.get('formArray');
  }

  getIndicators() {
    if (this.mitigationAction) {
      if (this.mitigationAction.id) {
        const code = this.mitigationAction.id;
        this.service.getMitigationActionIndicators(code).subscribe(
          (context) => {
            this.indicator = context;
          },
          (error) => {
            this.indicator = [];
          },
        );
      }
    }
  }

  buildPayload() {
    const context = {
      monitoring_reporting_indicator: {
        progress_in_monitoring: this.form.value.formArray[0].anyProgressMonitoringRecordedClimateActionsCtrl,
        monitoring_indicator: this.form.value.formArray[0].anyProgressMonitoringRecordedClimateActionsCtrl
          ? [
              {
                initial_date_report_period: this.datePipe.transform(
                  this.form.value.formArray[1].reportingPeriodStartCtrl,
                  'yyyy-MM-dd',
                ),

                final_date_report_period: this.datePipe.transform(
                  this.form.value.formArray[1].reportingPeriodEndCtrl,
                  'yyyy-MM-dd',
                ),

                data_updated_date: this.datePipe.transform(
                  this.form.value.formArray[1].indicatorDataUpdateDateCtrl,
                  'yyyy-MM-dd',
                ),
                report_type: this.form.value.formArray[1].reportTypeCtrl,
                progress_report_period: this.datePipe.transform(
                  this.form.value.formArray[2].reportingPeriodCtrl,
                  'yyyy-MM-dd',
                ),
                progress_report_period_until: this.datePipe.transform(
                  this.form.value.formArray[2].reportingPeriodUntilCtrl,
                  'yyyy-MM-dd',
                ),
                updated_data: this.form.value.formArray[1].informationToUpdateCtrl || null,
                progress_report: this.form.value.formArray[2].beenProgressActionPeriodCtrl || null,
                indicator: this.form.value.formArray[1].indicatorSelectionCtrl,
              },
            ]
          : [],
      },
    };
    if (this.mitigationAction.next_state[0].state === this.stateLabel) {
      context['is_complete'] = true;
    }
    const monitoringReporting = this.mitigationAction.monitoring_reporting_indicator['monitoring_indicator'];
    if (monitoringReporting && monitoringReporting.length > 0) {
      if (monitoringReporting[0].id) {
        context['monitoring_reporting_indicator']['monitoring_indicator']['id'] = monitoringReporting[0].id;
      }
    }

    return context;
  }

  submitForm() {
    const context = this.buildPayload();

    this.isLoading = true;

    this.service.submitMitigationActionUpdateForm(context, this.mitigationAction.id).subscribe({
      next: async (response) => {
        try {
          this.successSendForm();
          this.form.markAsPristine();
          this.wasSubmittedSuccessfully = true;
        } catch (err) {
          this.error = err;
          this.errorComponent.parseErrors(err);
          this.wasSubmittedSuccessfully = false;
        } finally {
          this.isLoading = false;
        }
      },
      error: (error) => {
        this.translateService.get('Error submitting form').subscribe((res: string) => {
          this.snackBar.open(res, null, { duration: 3000 });
        });
        this.error = error;
        this.errorComponent.parseErrors(error);
        this.wasSubmittedSuccessfully = false;
        this.isLoading = false;
      },
    });
  }

  async successSendForm() {
    if (this.newFiles.length) {
      this.uploadFiles();
    }

    this.translateService.get('specificLabel.sucessfullySubmittedForm').subscribe((res: string) => {
      this.snackBar.open(res, null, { duration: 3000 });
    });

    this.wasSubmittedSuccessfully = true;

    this.router.navigate(['/mitigation/actions'], { replaceUrl: true });
  }

  private createForm() {
    this.form = this.formBuilder.group({
      formArray: this.formBuilder.array([
        this.formBuilder.group({
          anyProgressMonitoringRecordedClimateActionsCtrl: ['', Validators.required],
        }),
        this.formBuilder.group({
          indicatorSelectionCtrl: [''],
          indicatorDataUpdateDateCtrl: ['', Validators.required],
          reportingPeriodStartCtrl: ['', Validators.required],
          reportingPeriodEndCtrl: ['', Validators.required],
          reportTypeCtrl: ['', Validators.required],
          informationToUpdateCtrl: ['', Validators.required],
        }),

        this.formBuilder.group({
          reportingPeriodCtrl: ['', Validators.required],
          reportingPeriodUntilCtrl: ['', Validators.required],
          beenProgressActionPeriodCtrl: ['', Validators.required],
        }),
      ]),
    });
  }

  private updateFormData() {
    const monitoring_indicator = this.mitigationAction.monitoring_reporting_indicator.monitoring_indicator;
    if (monitoring_indicator && monitoring_indicator.length > 0) {
      this.form = this.formBuilder.group({
        formArray: this.formBuilder.array([
          this.formBuilder.group({
            anyProgressMonitoringRecordedClimateActionsCtrl: [
              this.mitigationAction.monitoring_reporting_indicator.progress_in_monitoring,
              Validators.required,
            ],
          }),

          this.formBuilder.group({
            indicatorSelectionCtrl: [monitoring_indicator ? monitoring_indicator[0].indicator : ''],
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

          this.formBuilder.group({
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

  public openStartMessages() {
    this.translateService.get('mitigationAction.mesage1').subscribe((res: string) => {
      this.snackBar.open(res, 'Cerrar');
    });
  }

  async uploadFiles() {
    const entityId = this.getEntityId();
    this.service.submitFiles(this.mitigationAction.id, this.maFileType, this.newFiles, entityId, this.entityType);
  }

  onFileChange(files: File[]) {
    this.newFiles = files;
  }

  getEntityId() {
    return this.mitigationAction.monitoring_reporting_indicator.monitoring_indicator[0].id;
  }

  async submitFiles(id: string, file: FileUpload, monitoringId: string) {
    return this.service
      .submitFiles(id, file.type, file.filesToUpload, monitoringId, MAEntityType.MONITORING_INDICATOR)
      .toPromise();
  }

  getFiles() {
    return (
      this.mitigationAction?.monitoring_reporting_indicator?.monitoring_indicator?.[0]?.files?.filter(
        (file) => file.type === this.maFileType,
      ) || []
    );
  }
}
