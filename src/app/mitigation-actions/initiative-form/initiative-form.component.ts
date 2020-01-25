
import { Component, OnInit, ElementRef, ViewChild, EventEmitter, Output, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray, AbstractControl } from '@angular/forms';
import { finalize, tap } from 'rxjs/operators';
import { environment } from '@env/environment';
import { Logger, I18nService, AuthenticationService } from '@app/core';
import { MitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { MitigationActionNewFormData, InitiativeType } from '@app/mitigation-actions/mitigation-action-new-form-data';
import { MitigationAction } from '../mitigation-action';

const log = new Logger('MitigationAction');

@Component({
  selector: 'app-initiative-form',
  templateUrl: './initiative-form.component.html',
  styleUrls: ['./initiative-form.component.scss']
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
  // @Input() action: string;
  @Input() processedNewFormData: MitigationActionNewFormData;
  @Input() isUpdating: boolean;

  get formArray(): AbstractControl | null { return this.form.get('formArray'); }

  constructor(private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private i18nService: I18nService,
    private service: MitigationActionsService,
    private translateService: TranslateService,
    public snackBar: MatSnackBar) {
    // this.formData = new FormData();
    this.isLoading = true;
    // this.isUpdating = this.action === 'update';
    this.displayFinancialSource = false;
    this.createForm();
  }

  ngOnInit() {
    if (this.isUpdating) {
      this.service.currentMitigationAction.subscribe(message => {
        this.mitigationAction = message;
        this.updateFormData();
      });
    }
  }

  private createForm() {

    this.form = this.formBuilder.group({
      formArray: this.formBuilder.array([
        this.formBuilder.group({
          // initiativeRegisterTypeCtrl: ['', Validators.required],
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
          // initiativeContactCtrl: ['', Validators.required],
          initiativeContactNameCtrl: ['', Validators.required],
          initiativePositionCtrl: ['', Validators.required],
          initiativeEmailFormCtrl: ['', Validators.email],
          initiativePhoneCtrl: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
        })
      ])
    });


  }

  private updateFormData() {
    this.form = this.formBuilder.group({
      formArray: this.formBuilder.array([
        this.formBuilder.group({
          // initiativeRegisterTypeCtrl: ['', Validators.required],
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
          initiativeFinancingStatusTypeCtrl: [this.mitigationAction.initiative.finance.finance_source_type.id, Validators.required],
          initiatveFinancingSourceCtrl: this.mitigationAction.initiative.finance.source,
          initiativeBudgetCtrl: [this.mitigationAction.initiative.budget, Validators.required],
        }),
        this.formBuilder.group({
          // initiativeContactCtrl: ['', Validators.required],
          initiativeContactNameCtrl: [this.mitigationAction.initiative.contact.full_name, Validators.required],
          initiativePositionCtrl: [this.mitigationAction.initiative.contact.job_title, Validators.required],
          initiativeEmailFormCtrl: [this.mitigationAction.initiative.contact.email, Validators.email],
          initiativePhoneCtrl: [this.mitigationAction.initiative.contact.phone, Validators.compose([Validators.required, Validators.minLength(8)])],
        })
      ])
    });

    this.isLoading = false;
    // this.initiativeTypes = [{ id: 1, name: 'Proyect' }, { id: 2, name: 'Law' }, { id: 3, name: 'Goal' }];
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
        status: this.form.value.formArray[0].initiativeStatusCtrl
      },
      user: String(this.authenticationService.credentials.id),
      registration_type: this.processedNewFormData.registration_types[0].id
    };
    if (this.isUpdating) {
      context.initiative['id'] = this.mitigationAction.initiative.id;
      context.initiative.contact['id'] = this.mitigationAction.initiative.contact.id;
      context.initiative.finance['id'] = this.mitigationAction.initiative.finance.id;
      // context['update_existing_mitigation_action'] = true;
      this.service.submitMitigationActionUpdateForm(context, this.mitigationAction.id, this.i18nService.language.split('-')[0])
      .pipe(finalize(() => {
        this.form.markAsPristine();
        this.isLoading = false;
      }))
      .subscribe(response => {
        this.translateService.get('Sucessfully submitted form').subscribe((res: string) => { this.snackBar.open(res, null, { duration: 3000 }); });
        this.wasSubmittedSuccessfully = true;
      }, error => {
        this.translateService.get('Error submitting form').subscribe((res: string) => { this.snackBar.open(res, null, { duration: 3000 }); });
        log.debug(`New Mitigation Action Form error: ${error}`);
        this.error = error;
        this.wasSubmittedSuccessfully = false;
      });
    } else {

      this.service.submitMitigationActionNewForm(context)
      .pipe(finalize(() => {
        this.form.markAsPristine();
        this.isLoading = false;
      }))
      .subscribe(response => {
        this.translateService.get('Sucessfully submitted form').subscribe((res: string) => { this.snackBar.open(res, null, { duration: 3000 }); });
        this.wasSubmittedSuccessfully = true;
      }, error => {
        this.translateService.get('Error submitting form').subscribe((res: string) => { this.snackBar.open(res, null, { duration: 3000 }); });
        log.debug(`New Mitigation Action Form error: ${error}`);
        this.error = error;
        this.wasSubmittedSuccessfully = false;
      });
    }

  }

  financialSourceInputShown($event: any) {
    // todo: when we traslate in the backend we need to traslate this hardcoded value here
    const insuredSourceTypeId = this.processedNewFormData.finance_status.filter(financeSource => financeSource.status == 'Insured' || financeSource.status == 'Asegurado' ).map(({ id }) => id);
    this.displayFinancialSource = $event.value == insuredSourceTypeId;
  }

}
