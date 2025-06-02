import { DatePipe } from '@angular/common';
import { Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ErrorReportingComponent } from '@shared';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { finalize } from 'rxjs/operators';
import { MAFile, MitigationAction } from '../mitigation-action';
import { MitigationActionNewFormData } from '../mitigation-action-new-form-data';
import { MitigationActionsService } from '../mitigation-actions.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ReportingClimateActionFormComponent } from '../reporting-climate-action-form/reporting-climate-action-form.component';

@Component({
  selector: 'app-reporting-climate-action',
  templateUrl: './reporting-climate-action.component.html',
  styleUrl: './reporting-climate-action.component.scss',
  standalone: false,
})
export class ReportingClimateActionComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  indicator: any = [];
  error: string;
  form: UntypedFormGroup;
  isLoading = false;
  wasSubmittedSuccessfully = false;
  mitigationAction: MitigationAction;
  stateLabel = 'submitted';
  file: MAFile = {
    file: null,
    name: '',
  };
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
      });
    }
  }

  get formArray(): AbstractControl | null {
    return this.form.get('formArray');
  }

  openDialog(indicator: string, report?: string): void {
    const dialogRef = this.dialog.open(ReportingClimateActionFormComponent, {
      data: {
        mitigationAction: this.mitigationAction,
        report: report,
        indicator: indicator,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        console.log('Dialog result:', result);
      }
    });
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
}
