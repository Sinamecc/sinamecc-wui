import { Component, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ErrorReportingComponent } from '@shared';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { MitigationAction } from '../mitigation-action';
import { MitigationActionNewFormData } from '../mitigation-action-new-form-data';
import { MitigationActionsService } from '../mitigation-actions.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { PermissionService } from '@app/@core/permissions.service';
import { States } from '@app/@shared/next-state';
import { ReportingClimateActionFormComponent } from './reporting-climate-action-form/reporting-climate-action-form.component';

@Component({
  selector: 'app-reporting-climate-action',
  templateUrl: './reporting-climate-action.component.html',
  styleUrl: './reporting-climate-action.component.scss',
  standalone: false,
})
export class ReportingClimateActionComponent implements OnInit {
  @Output() wantsImpactEval = new EventEmitter<boolean>();
  @Input() stepper: any;
  @Input() newFormData: Observable<MitigationActionNewFormData>;
  @Input() processedNewFormData: MitigationActionNewFormData;
  @Input() isUpdating: boolean;
  @Input() action: string;
  @Input() mitigationActionToUpdate?: any;
  @ViewChild('errorComponent') errorComponent: ErrorReportingComponent;

  readonly dialog = inject(MatDialog);
  indicator: any = [];
  error: string;
  form: UntypedFormGroup;
  isLoading = false;
  wasSubmittedSuccessfully = false;
  mitigationAction: MitigationAction;
  includeImpactInfo = false;
  destroy$ = new Subject<void>();
  state: States;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private service: MitigationActionsService,
    private translateService: TranslateService,
    public snackBar: MatSnackBar,
    private router: Router,
    private permissions: PermissionService,
  ) {
    this.service.currentMitigationAction.pipe(takeUntil(this.destroy$)).subscribe((message) => {
      this.mitigationAction = message;
    });
    this.isUpdating = this.action === 'update';
  }

  ngOnInit() {
    if (!this.isUpdating) {
      this.openStartMessages();
    }

    this.service.currentMitigationAction.pipe(takeUntil(this.destroy$)).subscribe((message) => {
      this.mitigationAction = message;
      this.state = this.mitigationAction?.fsm_state.state as States;
      this.buildForm();
      const includeImpactControl = this.form.get(['formArray', 1, 'includeImpactInfoCtrl']);
      if (includeImpactControl) {
        includeImpactControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
          this.includeImpactInfo = value;
          this.wantsImpactEval.emit(value);
        });
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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
        state: this.state,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        if (result !== undefined) {
          console.log('Dialog result:', result);
        }
      });
  }

  getIndicators() {
    if (this.mitigationAction) {
      if (this.mitigationAction.id) {
        const code = this.mitigationAction.id;
        this.service
          .getMitigationActionIndicators(code)
          .pipe(takeUntil(this.destroy$))
          .subscribe(
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
          includeImpactInfoCtrl: [
            indicator.include_impact_info ?? '', // Replace with actual server value when available
            Validators.required,
          ],
        }),
      ]),
    });
  }

  public openStartMessages() {
    this.translateService
      .get('mitigationAction.mesage1')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: string) => {
        this.snackBar.open(res, 'Cerrar');
      });
  }

  buildPayload() {
    const context = {
      monitoring_reporting_indicator: {
        progress_in_monitoring: this.form.value.formArray[0].anyProgressMonitoringRecordedClimateActionsCtrl,
      },
    };
    return context;
  }

  submitForm() {
    const context = this.buildPayload();
    this.isLoading = true;
    if (this.permissions.canEditAcceptedMA(this.state)) {
      this.service
        .submitMitigationActionUpdateForm(context, this.mitigationAction.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: async () => {
            try {
              await this.successSendForm();
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
      this.navigateBasedOnImpact();
      this.isLoading = false;
    }
  }

  private async successSendForm() {
    this.translateService
      .get('specificLabel.sucessfullySubmittedForm')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: string) => {
        this.snackBar.open(res, null, { duration: 3000 });
      });
    this.wasSubmittedSuccessfully = true;
    this.navigateBasedOnImpact();
  }

  private handleError(error: any, fallbackMessage: string = '') {
    this.error = error;
    this.errorComponent.parseErrors(error);
    this.wasSubmittedSuccessfully = false;

    if (fallbackMessage) {
      this.translateService
        .get(fallbackMessage)
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: string) => {
          this.snackBar.open(res, null, { duration: 3000 });
        });
    }
  }

  private navigateBasedOnImpact() {
    if (this.includeImpactInfo) {
      this.stepper.next();
    } else {
      this.router.navigate(['/mitigation/actions'], { replaceUrl: true });
    }
  }
}
