import { Component, OnInit, ElementRef, ViewChild, EventEmitter, Output, Input} from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray, AbstractControl } from '@angular/forms';
import { finalize, tap } from 'rxjs/operators';
import { environment } from '@env/environment';
import { Logger, I18nService, AuthenticationService } from '@app/core';
import { MitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs';
import { MitigationActionNewFormData } from '@app/mitigation-actions/mitigation-action-new-form-data';
import { MitigationAction } from '../mitigation-action';

const log = new Logger('MitigationAction');

@Component({
  selector: 'app-impact-form',
  templateUrl: './impact-form.component.html',
  styleUrls: ['./impact-form.component.scss']
})
export class ImpactFormComponent implements OnInit {

  version: string = environment.version;
  error: string;
  form: FormGroup;
  isLoading = false;
  wasSubmittedSuccessfully:boolean = false;

  mitigationAction: MitigationAction;

  @Input() newFormData: Observable<MitigationActionNewFormData>;
  @Input() processedNewFormData: MitigationActionNewFormData;
  @Input() isUpdating: boolean;

  @Input() mitigationActionToUpdate?: any;

  get formArray(): AbstractControl | null { return this.form.get('formArray'); }

  constructor(private formBuilder: FormBuilder,
    private i18nService: I18nService,
    private service: MitigationActionsService,
    private authenticationService: AuthenticationService,
    private translateService: TranslateService,
    private router: Router,
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
          mitigationActionImpactCtrl: ['', Validators.required],
          emissionImpactCtrl: ['', Validators.required],
          calculationMethodologyCtrl: ['', Validators.required],
          internationalParticipationCtrl: ['', Validators.required],
          internationalParticipationDetailCtrl: null
        })
      ])
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
          internationalParticipationDetailCtrl: this.mitigationAction.international_participation
        })
      ])
    });

    this.isLoading = false;
    // this.initiativeTypes = [{ id: 1, name: 'Proyect' }, { id: 2, name: 'Law' }, { id: 3, name: 'Goal' }];
  }

  
  submitForm() {
    this.isLoading = true;
    let context = {
      impact_plan: this.form.value.formArray[0].mitigationActionImpactCtrl,
      impact: this.form.value.formArray[0].emissionImpactCtrl,
      calculation_methodology: this.form.value.formArray[0].calculationMethodologyCtrl,
      is_international: this.form.value.formArray[0].internationalParticipationCtrl,
      international_participation: this.form.value.formArray[0].internationalParticipationDetailCtrl,
      user: String(this.authenticationService.credentials.id),
      registration_type: this.processedNewFormData.registration_types[0].id
      // update_new_mitigation_action: false
    };
    if(this.isUpdating) {
      context['update_existing_mitigation_action'] = true;
    } else {
      context['update_new_mitigation_action'] = true;
    }
    this.service.submitMitigationActionUpdateForm(context, this.mitigationAction.id, this.i18nService.language.split('-')[0])
      .pipe(finalize(() => {
        this.form.markAsPristine();
        this.isLoading = false;
      }))
      .subscribe(response => {
        this.translateService.get('Sucessfully submitted form').subscribe((res: string) => { this.snackBar.open(res, null, {duration: 3000 }); });
        this.wasSubmittedSuccessfully = true;
        setTimeout(() => {
          this.router.navigate(['/mitigation/actions'], { replaceUrl: true });
       }, 2000);       
      }, error => {
        this.translateService.get('Error submitting form').subscribe((res: string) => { this.snackBar.open(res, null, { duration: 3000 }); });
        log.debug(`New Mitigation Action Form error: ${error}`);
        this.error = error;
        this.wasSubmittedSuccessfully = false;
      });
  }
}
