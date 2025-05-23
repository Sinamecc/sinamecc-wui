import { Component, OnInit, ElementRef, ViewChild, EventEmitter, Output, Input } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, AbstractControl, UntypedFormArray } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { environment } from '@env/environment';
import { Logger } from '@core';
import { MitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service';
import { MitigationActionNewFormData } from '@app/mitigation-actions/mitigation-action-new-form-data';

import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { MitigationAction } from '../mitigation-action';
import { ErrorReportingComponent } from '@shared';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

const log = new Logger('MitigationAction');

@Component({
  selector: 'app-basic-information-form',
  templateUrl: './basic-information-form.component.html',
  styleUrls: ['./basic-information-form.component.scss'],
  standalone: false,
})
export class BasicInformationFormComponent implements OnInit {
  version: string = environment.version;
  error: string;
  form: UntypedFormGroup;
  isLoading = false;
  wasSubmittedSuccessfully = false;
  mitigationAction: MitigationAction;
  mitigationActionBudgeValuetCtrl: string[] = [];
  startDate = new Date();
  selectedFood = '';
  budgetCtrlgroup: string;
  @Input() stepper: any;
  @Input() newFormData: Observable<MitigationActionNewFormData>;
  @Input() processedNewFormData: MitigationActionNewFormData;
  @Input() isUpdating: boolean;
  @ViewChild('errorComponent') errorComponent: ErrorReportingComponent;

  get formArray(): AbstractControl | null {
    return this.form.get('formArray');
  }

  constructor(
    private formBuilder: UntypedFormBuilder,
    private service: MitigationActionsService,
    private translateService: TranslateService,
    public snackBar: MatSnackBar,
    private datePipe: DatePipe,
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

  setmitigationActionBudgeValuetCtrl(value: string, index: number) {
    this.mitigationActionBudgeValuetCtrl[index] = value;
  }

  private createForm() {
    this.form = this.formBuilder.group({
      formArray: this.formBuilder.array([
        this.formBuilder.group({
          programCtrl: ['', Validators.required],
          stepsTakingToFinancingCtrl: [''],
          detailfinancingSourceCtrl: ['', Validators.required],
          financeFrmCtrl: this.formBuilder.array([this.createFinanceForm()]),
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
          programCtrl: [
            this.mitigationAction.finance.status ? this.mitigationAction.finance.status.id : '',
            Validators.required,
          ],
          stepsTakingToFinancingCtrl: [
            this.mitigationAction.finance.administration ? this.mitigationAction.finance.administration : '',
          ],
          detailfinancingSourceCtrl: [
            this.mitigationAction.finance.source.map((x: { id: any }) => x.id),
            Validators.required,
          ],
          financeFrmCtrl: this.createUpdateFinanceForm(),
        }),
        this.formBuilder.group({
          registeredNonReimbursableCooperationMideplanCtrl: [
            this.mitigationAction.finance.mideplan_registered ? 1 : 2,
            Validators.required,
          ],
          entityProjectCtrl: [this.mitigationAction.finance.executing_entity, Validators.required],
          registeredNonReimbursableCooperationMideplanDetailCtrl: [this.mitigationAction.finance.mideplan_project],
        }),
      ]),
    });

    this.setSection2Validations(this.mitigationAction.finance.mideplan_registered ? 1 : 2);
    this.isLoading = false;
  }

  private createFinanceForm() {
    this.mitigationActionBudgeValuetCtrl.push('CRC');
    return this.formBuilder.group({
      mitigationActionDescriptionCtrl: ['', [Validators.required, Validators.maxLength(300)]],
      currencyValueCtrl: ['CRC'],
      mitigationActionAmounttCtrl: ['', [Validators.required, Validators.maxLength(50)]],
      referenceYearCtrl: ['', Validators.required],
    });
  }

  private createUpdateFinanceForm() {
    this.mitigationActionBudgeValuetCtrl = [];
    const financeList: UntypedFormGroup[] = [];
    // const mapCurrency = ['CRC', 'USD', 'EUR'];
    let index = 0;

    for (const element of this.mitigationAction.finance.finance_information) {
      const currency =
        element.currency != 'CRC' && element.currency != 'USD' && element.currency != 'EUR'
          ? 'other'
          : element.currency;
      this.mitigationActionBudgeValuetCtrl.push(currency);
      const form = this.formBuilder.group({
        id: [element.id],
        mitigationActionDescriptionCtrl: [element.source_description, [Validators.required, Validators.maxLength(300)]],
        currencyValueCtrl: [element.currency],
        mitigationActionAmounttCtrl: [element.budget, [Validators.required, Validators.maxLength(50)]],
        referenceYearCtrl: [element.reference_year, Validators.required],
      });
      index += 1;
      financeList.push(form);
    }
    return this.formBuilder.array(financeList);
  }

  public addFinanceItem() {
    const control = <UntypedFormArray>this.form.controls.formArray['controls'][0].controls['financeFrmCtrl'].controls;
    control.push(this.createFinanceForm());
  }

  public removeFinanceItem(index: number) {
    const control = <UntypedFormArray>this.form.controls.formArray['controls'][0].controls['financeFrmCtrl'];
    control.removeAt(index);
  }

  buildPayload() {
    const context = {
      status: this.form.value.formArray[0].programCtrl,
      administration: this.form.value.formArray[0].stepsTakingToFinancingCtrl
        ? this.form.value.formArray[0].stepsTakingToFinancingCtrl
        : 'empty field',
      source: this.form.value.formArray[0].detailfinancingSourceCtrl,
      budget: this.form.value.formArray[0].mitigationActionAmounttCtrl,
      currency: this.mitigationActionBudgeValuetCtrl,
      mideplan_registered:
        this.form.value.formArray[1].registeredNonReimbursableCooperationMideplanCtrl === 1 ? true : false,

      executing_entity: this.form.value.formArray[1].entityProjectCtrl
        ? this.form.value.formArray[1].entityProjectCtrl
        : null,
    };

    const financeInformation = [];
    let index = 0;
    for (const element of this.form.controls.formArray['controls'][0].controls['financeFrmCtrl'].controls) {
      const financeinfo = {
        source_description: element.value.mitigationActionDescriptionCtrl,
        reference_year: this.datePipe.transform(element.value.referenceYearCtrl, 'yyyy-MM-dd'),
        currency:
          this.mitigationActionBudgeValuetCtrl[index] === 'other'
            ? element.value.currencyValueCtrl
            : this.mitigationActionBudgeValuetCtrl[index],
        budget: element.value.mitigationActionAmounttCtrl,
      };
      if (this.isUpdating) {
        financeinfo['id'] = element.value.id;
      }

      financeInformation.push(financeinfo);
      index += 1;
    }

    context['finance_information'] = financeInformation;

    if (this.form.value.formArray[1].registeredNonReimbursableCooperationMideplanCtrl === 1) {
      context['mideplan_project'] = this.form.value.formArray[1].registeredNonReimbursableCooperationMideplanDetailCtrl;
    }
    return context;
  }

  submitForm() {
    const context = { finance: this.buildPayload() };
    this.isLoading = true;

    this.service
      .submitMitigationActionUpdateForm(context, this.mitigationAction.id)
      .pipe(
        finalize(() => {
          this.form.markAsPristine();
          this.isLoading = false;
        }),
      )
      .subscribe(
        (response) => {
          this.translateService.get('specificLabel.saveInformation').subscribe((res: string) => {
            this.snackBar.open(res, null, { duration: 3000 });
          });
          this.wasSubmittedSuccessfully = true;
          this.stepper.next();
        },
        (error) => {
          this.translateService.get('Error submitting form').subscribe((res: string) => {
            this.snackBar.open(res, null, { duration: 3000 });
          });
          log.debug(`New Mitigation Action Form error: ${error}`);
          this.errorComponent.parseErrors(error);
          this.error = error;
          this.wasSubmittedSuccessfully = false;
        },
      );
  }

  public setSection2Validations(validations: number) {
    if (validations === 1) {
      this.form.get('formArray').get([1]).get('entityProjectCtrl').setValidators(Validators.required);
    } else {
      this.form.get('formArray').get([1]).get('entityProjectCtrl').setValidators(null);
    }
    this.form.get('formArray').get([1]).get('entityProjectCtrl').updateValueAndValidity();
  }

  onStepChange() {
    this.wasSubmittedSuccessfully = false;
  }
}
