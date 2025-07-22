import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
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
import { States } from '@app/@shared/next-state';
import { PermissionService } from '@app/@core/permissions.service';

@Component({
  selector: 'app-reporting-climate-action-form',
  templateUrl: './reporting-climate-action-form.component.html',
  styleUrls: ['./reporting-climate-action-form.component.scss'],
  standalone: false,
})
export class ReportingClimateActionFormComponent implements OnInit {
  @Input() stepper: any;

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
  state: States;
  @Output() wantsImpactEval = new EventEmitter<boolean>();

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
    public permissions: PermissionService,
    public snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private router: Router,
  ) {
    this.service.currentMitigationAction.subscribe((message) => {
      this.mitigationAction = message;
    });
    this.isUpdating = this.action === 'update';
  }

  ngOnInit() {
    if (!this.isUpdating) {
      this.openStartMessages();
    }
    this.service.currentMitigationAction.subscribe((message) => {
      this.mitigationAction = message;
      this.state = this.mitigationAction.fsm_state.state as States;
      this.buildForm();
      this.files = this.getFiles();
      const includeImpactControl = this.form.get(['formArray', 3, 'includeImpactInfoCtrl']);
      if (includeImpactControl) {
        includeImpactControl.valueChanges.subscribe((value) => {
          this.wantsImpactEval.emit(value);
        });
      }
    });
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
    const includeImpactControl = this.form.get(['formArray', 3, 'includeImpactInfoCtrl']);
    const includeImpact = includeImpactControl?.value ?? false;
    this.isLoading = true;
    if (this.permissions.canEditAcceptedMA(this.state)) {
      this.service.submitMitigationActionUpdateForm(context, this.mitigationAction.id).subscribe({
        next: async () => {
          try {
            await this.successSendForm(includeImpact);
            this.form.markAsPristine();
          } catch (err) {
            this.handleError(err);
          } finally {
            this.isLoading = false;
          }
        },
        error: (error) => {
          this.handleError(error, 'Error submitting form');
          this.isLoading = false;
        },
      });
    } else {
      this.navigateBasedOnImpact(includeImpact);
      this.isLoading = false;
    }
  }

  private async successSendForm(includeImpact: boolean) {
    if (this.newFiles.length) {
      await this.uploadFiles();
    }

    this.translateService.get('specificLabel.sucessfullySubmittedForm').subscribe((res: string) => {
      this.snackBar.open(res, null, { duration: 3000 });
    });

    this.wasSubmittedSuccessfully = true;
    this.navigateBasedOnImpact(includeImpact);
  }

  private navigateBasedOnImpact(includeImpact: boolean) {
    if (includeImpact) {
      this.stepper.next();
    } else {
      this.router.navigate(['/mitigation/actions'], { replaceUrl: true });
    }
  }

  private handleError(error: any, fallbackMessage: string = '') {
    this.error = error;
    this.errorComponent.parseErrors(error);
    this.wasSubmittedSuccessfully = false;

    if (fallbackMessage) {
      this.translateService.get(fallbackMessage).subscribe((res: string) => {
        this.snackBar.open(res, null, { duration: 3000 });
      });
    }
  }

  private buildForm() {
    const monitoringIndicator = this.mitigationAction?.monitoring_reporting_indicator?.monitoring_indicator;
    const canEdit = this.permissions.canEditAcceptedMA(this.state);

    const indicator = monitoringIndicator?.[0] ?? {};

    this.form = this.formBuilder.group({
      formArray: this.formBuilder.array([
        this.formBuilder.group({
          anyProgressMonitoringRecordedClimateActionsCtrl: [
            this.mitigationAction?.monitoring_reporting_indicator?.progress_in_monitoring ?? '',
            canEdit ? Validators.required : [],
          ],
        }),
        this.formBuilder.group({
          indicatorSelectionCtrl: [indicator.indicator ?? ''],
          indicatorDataUpdateDateCtrl: [indicator.data_updated_date ?? '', canEdit ? Validators.required : []],
          reportingPeriodStartCtrl: [indicator.initial_date_report_period ?? '', canEdit ? Validators.required : []],
          reportingPeriodEndCtrl: [indicator.final_date_report_period ?? '', canEdit ? Validators.required : []],
          reportTypeCtrl: [parseInt(indicator.report_type ?? '0'), canEdit ? Validators.required : []],
          informationToUpdateCtrl: [indicator.updated_data ?? '', canEdit ? Validators.required : []],
        }),
        this.formBuilder.group({
          reportingPeriodCtrl: [indicator.progress_report_period ?? '', canEdit ? Validators.required : []],
          reportingPeriodUntilCtrl: [indicator.progress_report_period_until ?? '', canEdit ? Validators.required : []],
          beenProgressActionPeriodCtrl: [indicator.progress_report ?? '', canEdit ? Validators.required : []],
        }),
        this.formBuilder.group({
          includeImpactInfoCtrl: [
            indicator.include_impact_info ?? '', // Replace with actual server value when available
            Validators.required,
          ],
        }),
      ]),
    });
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
