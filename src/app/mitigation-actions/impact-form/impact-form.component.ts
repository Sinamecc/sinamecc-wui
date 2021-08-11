import { Component, OnInit, Input } from '@angular/core';
import { Logger } from '@core';
import { environment } from '@env/environment';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MitigationAction } from '@app/mitigation-actions/mitigation-action';
import { Observable } from 'rxjs';
import { MitigationActionNewFormData } from '@app/mitigation-actions/mitigation-action-new-form-data';
import { I18nService } from '@app/i18n';
import { MitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service';
import { CredentialsService } from '@app/auth';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';

const log = new Logger('MitigationAction');

@Component({
  selector: 'app-impact-form',
  templateUrl: './impact-form.component.html',
  styleUrls: ['./impact-form.component.scss'],
})
export class ImpactFormComponent implements OnInit {
  version: string = environment.version;
  error: string;
  form: FormGroup;
  isLoading = false;
  wasSubmittedSuccessfully = false;

  mitigationAction: MitigationAction;

  @Input() newFormData: Observable<MitigationActionNewFormData>;
  @Input() processedNewFormData: MitigationActionNewFormData;
  @Input() isUpdating: boolean;

  @Input() mitigationActionToUpdate?: any;

  get formArray(): AbstractControl | null {
    return this.form.get('formArray');
  }

  constructor(
    private formBuilder: FormBuilder,
    private i18nService: I18nService,
    private service: MitigationActionsService,
    private credentialsService: CredentialsService,
    private translateService: TranslateService,
    private router: Router,
    public snackBar: MatSnackBar
  ) {
    this.service.currentMitigationAction.subscribe((message) => (this.mitigationAction = message));
    this.createForm();
  }

  ngOnInit(): void {
    if (this.isUpdating) {
      this.service.currentMitigationAction.subscribe((message) => {
        this.mitigationAction = message;
        this.updateFormData();
      });
    }
  }

  private createForm() {
    this.form = this.formBuilder.group({
      formArray: this.formBuilder.array([
        this.formBuilder.group({
          mitigationActionImpactCtrl: ['', Validators.required],
          emissionImpactCtrl: ['', Validators.required],
          calculationMethodologyCtrl: ['', Validators.required],
          internationalParticipationCtrl: ['', Validators.required],
          internationalParticipationDetailCtrl: null,
        }),
      ]),
    });
  }

  private updateFormData() {
    this.form = this.formBuilder.group({
      formArray: this.formBuilder.array([
        this.formBuilder.group({
          mitigationActionImpactCtrl: [this.mitigationAction.impact_plan, Validators.required],
          emissionImpactCtrl: [this.mitigationAction.impact, Validators.required],
          calculationMethodologyCtrl: [this.mitigationAction.calculation_methodology, Validators.required],
          internationalParticipationCtrl: [String(+this.mitigationAction.is_international), Validators.required],
          internationalParticipationDetailCtrl: this.mitigationAction.international_participation,
        }),
      ]),
    });

    this.isLoading = false;
  }

  submitForm() {
    this.isLoading = true;
    const context = {
      impact_plan: this.form.value.formArray[0].mitigationActionImpactCtrl,
      impact: this.form.value.formArray[0].emissionImpactCtrl,
      calculation_methodology: this.form.value.formArray[0].calculationMethodologyCtrl,
      is_international: this.form.value.formArray[0].internationalParticipationCtrl,
      international_participation: this.form.value.formArray[0].internationalParticipationDetailCtrl,
      user: String(this.credentialsService.credentials.id),
      registration_type: this.processedNewFormData.registration_types[0].id,
      // update_new_mitigation_action: false
    };
    if (this.isUpdating) {
      context['update_existing_mitigation_action'] = true;
    } else {
      context['update_new_mitigation_action'] = true;
    }
    this.service
      .submitMitigationActionUpdateForm(context, this.mitigationAction.id, this.i18nService.language.split('-')[0])
      .pipe(
        finalize(() => {
          this.form.markAsPristine();
          this.isLoading = false;
        })
      )
      .subscribe(
        (response) => {
          this.translateService.get('sucessfullySubmittedForm').subscribe((res: string) => {
            this.snackBar.open(res, null, { duration: 3000 });
          });
          this.wasSubmittedSuccessfully = true;
          setTimeout(() => {
            this.router.navigate(['/mitigation/actions'], { replaceUrl: true });
          }, 2000);
        },
        (error) => {
          this.translateService.get('Error submitting form').subscribe((res: string) => {
            this.snackBar.open(res, null, { duration: 3000 });
          });
          log.debug(`New Mitigation Action Form error: ${error}`);
          this.error = error;
          this.wasSubmittedSuccessfully = false;
        }
      );
  }
}
