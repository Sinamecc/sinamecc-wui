import { Component, OnInit, Input } from '@angular/core';
import { Logger } from '@core';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MitigationActionNewFormData, InitiativeType } from '@app/mitigation-actions/mitigation-action-new-form-data';
import { MitigationAction } from '@app/mitigation-actions/mitigation-action';
import { CredentialsService } from '@app/auth';
import { I18nService } from '@app/i18n';
import { MitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';

const log = new Logger('MitigationAction');

@Component({
  selector: 'app-initiative-form',
  templateUrl: './initiative-form.component.html',
  styleUrls: ['./initiative-form.component.scss'],
})
export class InitiativeFormComponent implements OnInit {
  version: string = environment.version;
  error: string;
  form: FormGroup;
  isLoading = false;
  isLinear = true;
  wasSubmittedSuccessfully = false;
  initiativeTypes: InitiativeType[];
  displayFinancialSource: boolean;

  mitigationAction: MitigationAction;

  @Input() newFormData: Observable<MitigationActionNewFormData>;
  @Input() processedNewFormData: MitigationActionNewFormData;
  @Input() isUpdating: boolean;

  get formArray(): AbstractControl | null {
    return this.form.get('formArray');
  }

  constructor(
    private formBuilder: FormBuilder,
    private credentialsService: CredentialsService,
    private i18nService: I18nService,
    private service: MitigationActionsService,
    private translateService: TranslateService,
    public snackBar: MatSnackBar
  ) {
    this.isLoading = true;
    this.displayFinancialSource = false;
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
          initiativeTypeCtrl: ['', Validators.required],
          initiativeNameCtrl: ['', Validators.required],
          entityIniativeResponsibleCtrl: ['', Validators.required],
          initiativeObjectiveCtrl: ['', Validators.required],
          initiativeDescriptionCtrl: ['', Validators.required],
          initiativeGoalCtrl: ['', Validators.required],
          initiativeStatusCtrl: ['', Validators.required],
        }),
        this.formBuilder.group({
          initiativeFinancingStatusCtrl: ['', Validators.required],
          initiativeFinancingStatusTypeCtrl: ['', Validators.required],
          initiatveFinancingSourceCtrl: '',
          initiativeBudgetCtrl: ['', Validators.required],
        }),
        this.formBuilder.group({
          initiativeContactNameCtrl: ['', Validators.required],
          initiativePositionCtrl: ['', Validators.required],
          initiativeEmailFormCtrl: ['', Validators.email],
          initiativePhoneCtrl: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
        }),
      ]),
    });
  }

  private updateFormData() {
    this.form = this.formBuilder.group({
      formArray: this.formBuilder.array([
        this.formBuilder.group({
          initiativeTypeCtrl: [this.mitigationAction.initiative.initiative_type.id, Validators.required],
          initiativeNameCtrl: [this.mitigationAction.initiative.name, Validators.required],
          entityIniativeResponsibleCtrl: [this.mitigationAction.initiative.entity_responsible, Validators.required],
          initiativeObjectiveCtrl: [this.mitigationAction.initiative.objective, Validators.required],
          initiativeDescriptionCtrl: [this.mitigationAction.initiative.description, Validators.required],
          initiativeGoalCtrl: [this.mitigationAction.initiative.goal, Validators.required],
          initiativeStatusCtrl: [this.mitigationAction.initiative.status.id, Validators.required],
        }),
        this.formBuilder.group({
          initiativeFinancingStatusCtrl: [this.mitigationAction.initiative.finance.status.id, Validators.required],
          initiativeFinancingStatusTypeCtrl: [
            this.mitigationAction.initiative.finance.finance_source_type.id,
            Validators.required,
          ],
          initiatveFinancingSourceCtrl: this.mitigationAction.initiative.finance.source,
          initiativeBudgetCtrl: [this.mitigationAction.initiative.budget, Validators.required],
        }),
        this.formBuilder.group({
          initiativeContactNameCtrl: [this.mitigationAction.initiative.contact.full_name, Validators.required],
          initiativePositionCtrl: [this.mitigationAction.initiative.contact.job_title, Validators.required],
          initiativeEmailFormCtrl: [this.mitigationAction.initiative.contact.email, Validators.email],
          initiativePhoneCtrl: [
            this.mitigationAction.initiative.contact.phone,
            Validators.compose([Validators.required, Validators.minLength(8)]),
          ],
        }),
      ]),
    });

    this.isLoading = false;
  }

  submitForm() {
    this.isLoading = true;
    const context = {
      initiative: {
        name: this.form.value.formArray[0].initiativeNameCtrl,
        objective: this.form.value.formArray[0].initiativeObjectiveCtrl,
        description: this.form.value.formArray[0].initiativeDescriptionCtrl,
        goal: this.form.value.formArray[0].initiativeGoalCtrl,
        initiative_type: this.form.value.formArray[0].initiativeTypeCtrl,
        entity_responsible: this.form.value.formArray[0].entityIniativeResponsibleCtrl,
        contact: {
          full_name: this.form.value.formArray[2].initiativeContactNameCtrl,
          job_title: this.form.value.formArray[2].initiativePositionCtrl,
          email: this.form.value.formArray[2].initiativeEmailFormCtrl,
          phone: this.form.value.formArray[2].initiativePhoneCtrl,
        },
        budget: this.form.value.formArray[1].initiativeBudgetCtrl,
        finance: {
          finance_source_type: this.form.value.formArray[1].initiativeFinancingStatusTypeCtrl,
          source: this.form.value.formArray[1].initiatveFinancingSourceCtrl,
          status: this.form.value.formArray[1].initiativeFinancingStatusCtrl,
        },
        status: this.form.value.formArray[0].initiativeStatusCtrl,
      },
      user: String(this.credentialsService.credentials.id),
      registration_type: this.processedNewFormData.registration_types[0].id,
    };
    if (this.isUpdating) {
      context.initiative['id'] = this.mitigationAction.initiative.id;
      context.initiative.contact['id'] = this.mitigationAction.initiative.contact.id;
      context.initiative.finance['id'] = this.mitigationAction.initiative.finance.id;
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
    } else {
      this.service
        .submitMitigationActionNewForm(context)
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

  financialSourceInputShown($event: any) {
    // todo: when we translate in the backend we need to translate this hardcoded value here
    const insuredSourceTypeId = this.processedNewFormData.finance_status
      .filter((financeSource) => financeSource.status === 'Insured' || financeSource.status === 'Asegurado')
      .map(({ id }) => id);
    this.displayFinancialSource = $event.value === insuredSourceTypeId;
  }
}
