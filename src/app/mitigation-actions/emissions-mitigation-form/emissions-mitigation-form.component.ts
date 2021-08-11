import { Component, OnInit, Input } from '@angular/core';
import { Logger } from '@core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { MitigationActionNewFormData } from '@app/mitigation-actions/mitigation-action-new-form-data';
import { MitigationAction } from '@app/mitigation-actions/mitigation-action';
import { I18nService } from '@app/i18n';
import { MitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service';
import { TranslateService } from '@ngx-translate/core';
import { CredentialsService } from '@app/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';

const log = new Logger('MitigationAction');

@Component({
  selector: 'app-emissions-mitigation-form',
  templateUrl: './emissions-mitigation-form.component.html',
  styleUrls: ['./emissions-mitigation-form.component.scss'],
})
export class EmissionsMitigationFormComponent implements OnInit {
  version: string = environment.version;
  error: string;
  form: FormGroup;
  @Input() newFormData: Observable<MitigationActionNewFormData>;
  @Input() processedNewFormData: MitigationActionNewFormData;
  @Input() isUpdating: boolean;
  isLoading = false;
  wasSubmittedSuccessfully = false;

  mitigationAction: MitigationAction;

  get formArray(): AbstractControl | null {
    return this.form.get('formArray');
  }

  constructor(
    private formBuilder: FormBuilder,
    private i18nService: I18nService,
    private service: MitigationActionsService,
    private translateService: TranslateService,
    private credentialsService: CredentialsService,
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
          ingeiComplianceCtrl: null,
        }),
        this.formBuilder.group({
          emissionSourceCtrl: ['', Validators.required],
          carbonSinksCtrl: ['', Validators.required],
        }),
      ]),
    });
  }

  private updateFormData() {
    this.form = this.formBuilder.group({
      formArray: this.formBuilder.array([
        this.formBuilder.group({
          ingeiComplianceCtrl: [
            this.mitigationAction['ingei_compliances'].map((elem: any) => elem.id),
            Validators.required,
          ],
        }),
        this.formBuilder.group({
          emissionSourceCtrl: [this.mitigationAction.emissions_source, Validators.required],
          carbonSinksCtrl: [this.mitigationAction.carbon_sinks, Validators.required],
        }),
      ]),
    });

    this.isLoading = false;
  }

  submitForm() {
    this.isLoading = true;
    const context = {
      ingei_compliances: this.form.value.formArray[0].ingeiComplianceCtrl
        ? this.form.value.formArray[0].ingeiComplianceCtrl.join()
        : '',
      emissions_source: this.form.value.formArray[1].emissionSourceCtrl,
      carbon_sinks: this.form.value.formArray[1].carbonSinksCtrl,
      user: String(this.credentialsService.credentials.id),
      registration_type: this.processedNewFormData.registration_types[0].id,
    };

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
  }
}
