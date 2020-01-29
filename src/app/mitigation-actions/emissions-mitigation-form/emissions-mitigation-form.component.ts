import { Component, OnInit, ElementRef, ViewChild, EventEmitter, Output, Input} from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray, AbstractControl } from '@angular/forms';
import { finalize, tap } from 'rxjs/operators';
import { environment } from '@env/environment';
import { Logger, I18nService, AuthenticationService } from '@app/core';
import { MitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { MitigationActionNewFormData, IngeiCompliance } from '@app/mitigation-actions/mitigation-action-new-form-data';
import { MitigationAction } from '../mitigation-action';

const log = new Logger('MitigationAction');
@Component({
  selector: 'app-emissions-mitigation-form',
  templateUrl: './emissions-mitigation-form.component.html',
  styleUrls: ['./emissions-mitigation-form.component.scss']
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


  get formArray(): AbstractControl | null { return this.form.get('formArray'); }

  constructor(private formBuilder: FormBuilder,
    private i18nService: I18nService,
    private service: MitigationActionsService,
    private translateService: TranslateService,
    private authenticationService: AuthenticationService,
    public snackBar: MatSnackBar) {
      // this.formData = new FormData();
      this.service.currentMitigationAction.subscribe(message => this.mitigationAction = message);
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
          ingeiComplianceCtrl: null,
        }),
        this.formBuilder.group({
          emissionSourceCtrl: ['', Validators.required],
          carbonSinksCtrl: ['', Validators.required],
        })
      ])
    });
  }


  private updateFormData() {
    this.form = this.formBuilder.group({
      formArray: this.formBuilder.array([
        this.formBuilder.group({
          ingeiComplianceCtrl: [this.mitigationAction['ingei_compliances'].map((elem: any) => elem.id), Validators.required],
        }),
        this.formBuilder.group({
          emissionSourceCtrl: [this.mitigationAction.emissions_source, Validators.required],
          carbonSinksCtrl: [this.mitigationAction.carbon_sinks, Validators.required]
        })
      ])
    });

    this.isLoading = false;
    // this.initiativeTypes = [{ id: 1, name: 'Proyect' }, { id: 2, name: 'Law' }, { id: 3, name: 'Goal' }];
  }

  submitForm() {
    this.isLoading = true;
    const context = {
      ingei_compliances: this.form.value.formArray[0].ingeiComplianceCtrl ? this.form.value.formArray[0].ingeiComplianceCtrl.join() : '',
      emissions_source: this.form.value.formArray[1].emissionSourceCtrl,
      carbon_sinks: this.form.value.formArray[1].carbonSinksCtrl,
      user: String(this.authenticationService.credentials.id),
      registration_type: this.processedNewFormData.registration_types[0].id
    };

    this.service.submitMitigationActionUpdateForm(context, this.mitigationAction.id, this.i18nService.language.split('-')[0])
    .pipe(finalize(() => {
      this.form.markAsPristine();
      this.isLoading = false;
    }))
    .subscribe(response => {
      this.translateService.get('Sucessfully submitted form').subscribe((res: string) => { this.snackBar.open(res, null, {duration: 3000 }); });
      this.wasSubmittedSuccessfully = true;
    }, error => {
      this.translateService.get('Error submitting form').subscribe((res: string) => { this.snackBar.open(res, null, { duration: 3000 }); });
      log.debug(`New Mitigation Action Form error: ${error}`);
      this.error = error;
      this.wasSubmittedSuccessfully = false;
    });
  }


}
