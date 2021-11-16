import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { environment } from '@env/environment';
import { Logger } from '@core';
import { MitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { MitigationActionNewFormData } from '@app/mitigation-actions/mitigation-action-new-form-data';
import { MitigationAction } from '../mitigation-action';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

import * as _moment from 'moment';
import { ErrorReportingComponent } from '@shared';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { I18nService } from '@app/i18n';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LLL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

const log = new Logger('MitigationAction');

@Component({
  selector: 'app-key-aspects-form',
  templateUrl: './key-aspects-form.component.html',
  styleUrls: ['./key-aspects-form.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class KeyAspectsFormComponent implements OnInit {
  version: string = environment.version;
  error: string;
  form: FormGroup;
  displayFinancialSource: boolean;
  isLoading = false;
  wasSubmittedSuccessfully = false;

  mitigationAction: MitigationAction;

  @Input() newFormData: Observable<MitigationActionNewFormData>;
  @Input() processedNewFormData: MitigationActionNewFormData;
  @Input() isUpdating: boolean;

  @ViewChild('errorComponent') errorComponent: ErrorReportingComponent;

  get formArray(): AbstractControl | null {
    return this.form.get('formArray');
  }

  constructor(
    private formBuilder: FormBuilder,
    private i18nService: I18nService,
    private service: MitigationActionsService,
    private translateService: TranslateService,
    public snackBar: MatSnackBar,
    private router: Router
  ) {
    // this.formData = new FormData();
    this.service.currentMitigationAction.subscribe((message) => (this.mitigationAction = message));
    this.createForm();
    this.displayFinancialSource = false;
  }

  ngOnInit() {
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
          overviewImpactEmissionsRemovalsCtrl: ['', Validators.required],
          graphicLogicImpactEmissionsRemovalsCtrl: ['', Validators.required],
        }),
      ]),
    });
  }

  private updateFormData() {
    this.form = this.formBuilder.group({
      formArray: this.formBuilder.array([
        this.formBuilder.group({
          actionObjectiveCtrl: [this.mitigationAction.purpose, Validators.required],
          actionStatusCtrl: [this.mitigationAction.status.id, Validators.required],
          implementationInitialDateCtrl: [this.mitigationAction.start_date, Validators.required],
          implementationEndDateCtrl: [this.mitigationAction.end_date, Validators.required],
        }),
        this.formBuilder.group({
          geographicScaleCtrl: [this.mitigationAction.geographic_scale.id, Validators.required],
        }),
        this.formBuilder.group({
          locationNameCtrl: [this.mitigationAction.location.geographical_site, Validators.required],
          gisAnnexedCtrl: [String(+this.mitigationAction.location.is_gis_annexed), Validators.required],
        }),
        this.formBuilder.group({
          financingStatusCtrl: [this.mitigationAction.finance.status.id, Validators.required],
          financingSourceCtrl: [this.mitigationAction.finance.source],
          gasInventoryCtrl: [this.mitigationAction.gas_inventory],
        }),
      ]),
    });

    this.isLoading = false;
    // this.initiativeTypes = [{ id: 1, name: 'Proyect' }, { id: 2, name: 'Law' }, { id: 3, name: 'Goal' }];
  }

  buildPayload() {
    const context = {
      ghg_information: {
        impact_emission: this.form.value.formArray[0].overviewImpactEmissionsRemovalsCtrl,
        graphic_description: this.form.value.formArray[0].graphicLogicImpactEmissionsRemovalsCtrl,
      },
    };

    return context;
  }

  submitForm() {
    this.isLoading = true;
    const context = this.buildPayload();

    /*
		if (this.isUpdating) {
			context.finance["id"] = this.mitigationAction.finance.id;
			context.location["id"] = this.mitigationAction.location.id;
			// context['update_existing_mitigation_action'] = true;
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

          // temp route for finish form

          //setTimeout(() => {
          //	this.router.navigate(["/mitigation/actions"], { replaceUrl: true });
          //}, 2000);
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

  financialSourceInputShown($event: any) {
    // todo: when we traslate in the backend we need to traslate this hardcoded value here
    const insuredSourceTypeId = this.processedNewFormData.finance_status
      .filter((financeSource) => financeSource.status === 'Asegurado' || financeSource.status === 'Insured')
      .map(({ id }) => id);
    this.displayFinancialSource = $event.value === insuredSourceTypeId;
  }
}
