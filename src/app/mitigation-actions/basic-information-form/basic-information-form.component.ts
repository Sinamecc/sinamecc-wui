import { Component, OnInit, ElementRef, ViewChild, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { environment } from '@env/environment';
import { Logger } from '@core';
import { MitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service';
import { MitigationActionNewFormData } from '@app/mitigation-actions/mitigation-action-new-form-data';

import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { MitigationAction } from '../mitigation-action';
import { ErrorReportingComponent } from '@shared';
import { DatePipe } from '@angular/common';

const log = new Logger('MitigationAction');

@Component({
  selector: 'app-basic-information-form',
  templateUrl: './basic-information-form.component.html',
  styleUrls: ['./basic-information-form.component.scss'],
})
export class BasicInformationFormComponent implements OnInit {
  version: string = environment.version;
  error: string;
  form: FormGroup;
  isLoading = false;
  wasSubmittedSuccessfully = false;
  mitigationAction: MitigationAction;
  mitigationActionBudgeValuetCtrl = 'CRC';
  startDate = new Date();
  selectedFood = '';

  @Input() newFormData: Observable<MitigationActionNewFormData>;
  @Input() processedNewFormData: MitigationActionNewFormData;
  @Input() isUpdating: boolean;
  @ViewChild('errorComponent') errorComponent: ErrorReportingComponent;

  get formArray(): AbstractControl | null {
    return this.form.get('formArray');
  }

  constructor(
    private formBuilder: FormBuilder,
    private service: MitigationActionsService,
    private translateService: TranslateService,
    public snackBar: MatSnackBar,
    private datePipe: DatePipe
  ) {
    this.service.currentMitigationAction.subscribe((message) => {
      this.mitigationAction = message;
    });
    this.createForm();
  }

  ngOnInit() {
    if (this.isUpdating) {
      this.service.currentMitigationAction.subscribe((message) => {
        this.mitigationAction = message;
        this.updateFormData();
      });
    }
  }

  setmitigationActionBudgeValuetCtrl(value: string) {
    this.mitigationActionBudgeValuetCtrl = value;
  }

  private createForm() {
    this.form = this.formBuilder.group({
      formArray: this.formBuilder.array([
        this.formBuilder.group({
          programCtrl: ['', Validators.required],
          stepsTakingToFinancingCtrl: [''],
          detailfinancingSourceCtrl: ['', Validators.required],
          financingSourceApplyingCtrl: ['', Validators.required],
          mitigationActionBudgetCtrl: ['', Validators.required],
          referenceYearCtrl: ['', Validators.required],
        }),
        this.formBuilder.group({
          registeredNonReimbursableCooperationMideplanCtrl: ['', Validators.required],
          entityProjectCtrl: ['', Validators.required],
          registeredNonReimbursableCooperationMideplanDetailCtrl: [''],
        }),
      ]),
    });
  }

  private updateFormData() {
    this.form = this.formBuilder.group({
      formArray: this.formBuilder.array([
        this.formBuilder.group({
          programCtrl: [this.mitigationAction.strategy_name, Validators.required],
          nameCtrl: [this.mitigationAction.name, Validators.required],
          entityCtrl: [this.mitigationAction.institution.id, Validators.required],
        }),
        this.formBuilder.group({
          contactNameCtrl: [this.mitigationAction.contact.full_name, Validators.required],
          positionCtrl: [this.mitigationAction.contact.job_title, Validators.required],
          emailFormCtrl: [this.mitigationAction.contact.email, Validators.email],
          phoneCtrl: [
            this.mitigationAction.contact.phone,
            Validators.compose([Validators.required, Validators.minLength(8)]),
          ],
        }),
      ]),
    });

    this.isLoading = false;
  }

  buildPayload() {
    const context = {
      status: this.form.value.formArray[0].programCtrl,
      administration: this.form.value.formArray[0].stepsTakingToFinancingCtrl
        ? this.form.value.formArray[0].stepsTakingToFinancingCtrl
        : 'empty field',
      source: this.form.value.formArray[0].detailfinancingSourceCtrl,
      source_description: this.form.value.formArray[0].financingSourceApplyingCtrl,
      reference_year: this.datePipe.transform(this.form.value.formArray[0].referenceYearCtrl, 'yyyy'),
      budget: this.form.value.formArray[0].mitigationActionBudgetCtrl,
      currency: this.mitigationActionBudgeValuetCtrl,
      mideplan_registered:
        this.form.value.formArray[1].registeredNonReimbursableCooperationMideplanCtrl === 1 ? true : false,

      executing_entity: this.form.value.formArray[1].entityProjectCtrl,
    };

    if (this.form.value.formArray[1].registeredNonReimbursableCooperationMideplanCtrl === 1) {
      context['mideplan_project'] = this.form.value.formArray[1].registeredNonReimbursableCooperationMideplanDetailCtrl;
    }
    return context;
  }

  submitForm() {
    const context = { finance: this.buildPayload() };
    this.isLoading = true;

    /*
		const context = {
			contact: {
				full_name: this.form.value.formArray[1].contactNameCtrl,
				job_title: this.form.value.formArray[1].positionCtrl,
				email: this.form.value.formArray[1].emailFormCtrl,
				phone: this.form.value.formArray[1].phoneCtrl
			},
			strategy_name: this.form.value.formArray[0].programCtrl,
			name: this.form.value.formArray[0].nameCtrl,
			institution: this.form.value.formArray[0].entityCtrl,
			user: String(this.authenticationService.credentials.id),
			registration_type: this.processedNewFormData.initiative_type[0].id
		};
		if (this.isUpdating) {
			context.contact["id"] = this.mitigationAction.contact.id;
		}

		*/
    this.service
      .submitMitigationActionUpdateForm(context, this.mitigationAction.id)
      .pipe(
        finalize(() => {
          this.form.markAsPristine();
          this.isLoading = false;
        })
      )
      .subscribe(
        (response) => {
          this.translateService.get('Sucessfully submitted form').subscribe((res: string) => {
            this.snackBar.open(res, null, { duration: 3000 });
          });
          this.wasSubmittedSuccessfully = true;
        },
        (error) => {
          this.translateService.get('Error submitting form').subscribe((res: string) => {
            this.snackBar.open(res, null, { duration: 3000 });
          });
          log.debug(`New Mitigation Action Form error: ${error}`);
          this.errorComponent.parseErrors(error);
          this.error = error;
          this.wasSubmittedSuccessfully = false;
        }
      );
  }
}
