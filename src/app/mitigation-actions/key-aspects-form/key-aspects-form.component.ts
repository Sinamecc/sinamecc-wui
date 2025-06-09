import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { UntypedFormGroup, UntypedFormBuilder, Validators, AbstractControl } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { environment } from '@env/environment';
import { Logger } from '@core';
import { MitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { MitigationActionNewFormData } from '@app/mitigation-actions/mitigation-action-new-form-data';
import { ImpactEmission, MAFile, MitigationAction, MAStates } from '../mitigation-action';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

import * as _moment from 'moment';
import { ErrorReportingComponent } from '@shared';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { I18nService } from '@app/i18n';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  standalone: false,
})
export class KeyAspectsFormComponent implements OnInit {
  version: string = environment.version;
  error: string;
  form: UntypedFormGroup;
  displayFinancialSource: boolean;
  isLoading = false;
  wasSubmittedSuccessfully = false;

  mitigationAction: MitigationAction;

  ghg_information: MAFile = {
    file: null,
    name: '',
  };

  @Input() stepper: any;
  @Input() newFormData: Observable<MitigationActionNewFormData>;
  @Input() processedNewFormData: MitigationActionNewFormData;
  @Input() isUpdating: boolean;
  @Output() state = new EventEmitter<MAStates>();

  @ViewChild('errorComponent') errorComponent: ErrorReportingComponent;

  get formArray(): AbstractControl | null {
    return this.form.get('formArray');
  }

  constructor(
    private formBuilder: UntypedFormBuilder,
    private i18nService: I18nService,
    private service: MitigationActionsService,
    private translateService: TranslateService,
    public snackBar: MatSnackBar,
    private router: Router,
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
        this.state.emit(this.mitigationAction.fsm_state.state as MAStates);
      });
    }
  }

  private createForm() {
    this.form = this.formBuilder.group({
      formArray: this.formBuilder.array([
        this.formBuilder.group({
          overviewImpactEmissionsRemovalsCtrl: ['', Validators.required],
          graphicLogicImpactEmissionsRemovalsCtrl: ['', Validators.required],
          impactSectorCtrl: ['', Validators.required],
          goalsCtrl: ['', Validators.required],
        }),
      ]),
    });
  }

  private updateFormData() {
    const impactSector = this.mitigationAction.ghg_information.impact_sector as ImpactEmission[];

    this.form = this.formBuilder.group({
      formArray: this.formBuilder.array([
        this.formBuilder.group({
          overviewImpactEmissionsRemovalsCtrl: [
            this.mitigationAction.ghg_information.impact_emission,
            Validators.required,
          ],
          graphicLogicImpactEmissionsRemovalsCtrl: [
            this.mitigationAction.ghg_information.graphic_description,
            Validators.required,
          ],
          impactSectorCtrl: [impactSector.map((x) => x.id), Validators.required],
          goalsCtrl: [this.mitigationAction.ghg_information.goals.map((x) => x.id), Validators.required],
        }),
      ]),
    });

    this.isLoading = false;
  }

  buildPayload() {
    const context = {
      ghg_information: {
        impact_emission: this.form.value.formArray[0].overviewImpactEmissionsRemovalsCtrl,
        graphic_description: this.form.value.formArray[0].graphicLogicImpactEmissionsRemovalsCtrl,
        impact_sector: this.form.value.formArray[0].impactSectorCtrl,
        goals: this.form.value.formArray[0].goalsCtrl,
      },
    };

    return context;
  }

  submitForm() {
    this.isLoading = true;
    const context = this.buildPayload();

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
          this.state.emit(response.state as MAStates);
          this.successSendForm(response.id);
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

  successSendForm(id: string) {
    if (this.ghg_information.file) {
      this.submitFile(id, this.ghg_information.name, this.ghg_information.file);
    }

    this.translateService.get('specificLabel.saveInformation').subscribe((res: string) => {
      this.snackBar.open(res, null, { duration: 3000 });
    });
    this.wasSubmittedSuccessfully = true;

    this.stepper.next();
  }

  financialSourceInputShown($event: any) {
    // todo: when we traslate in the backend we need to traslate this hardcoded value here
    const insuredSourceTypeId = this.processedNewFormData.finance_status
      .filter((financeSource) => financeSource.status === 'Asegurado' || financeSource.status === 'Insured')
      .map(({ id }) => id);
    this.displayFinancialSource = $event.value === insuredSourceTypeId;
  }

  uploadFile(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;
    const name = element.name;
    if (fileList) {
      this.ghg_information = {
        file: fileList[0],
        name: name,
      };
    }
  }

  async submitFile(id: string, key: string, file: File) {
    await this.service.submitMitigationFile(key, file, id).toPromise();
  }
}
