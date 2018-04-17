import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { environment } from '@env/environment';
import { Logger, I18nService, AuthenticationService } from '@app/core';
import { MitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service';
import { MitigationActionNewFormData } from '@app/mitigation-actions/mitigation-action-new-form-data';

const log = new Logger('Report');


@Component({
  selector: 'app-mitigation-actions-new',
  templateUrl: './mitigation-actions-new.component.html',
  styleUrls: ['./mitigation-actions-new.component.scss']
})
export class MitigationActionsNewComponent implements OnInit {

  version: string = environment.version;
  error: string;
  formGroup: FormGroup;
  isLoading = false;
  isNonLinear = false;
  initalRequiredData: MitigationActionNewFormData;
  startDate = new Date(1990, 0, 1);
  institutions = [
    {name: 'MINAE', value: '1'},
    {name: 'SINAMECC', value: '2'}
  ];

  statusses = [
    {name: 'Planeación', value: '1'},
    {name: 'Implementación', value: '2'},
    {name: 'Finalizada', value: '3'}
  ];

  get formArray(): AbstractControl | null { return this.formGroup.get('formArray'); }

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private i18nService: I18nService,
    private service: MitigationActionsService) {
    this.createForm();
    console.log(this.formArray.get([0]));
  }

  ngOnInit() { }

  submitForm() {
    this.isLoading = true;


    this.service.submitMitigationActionNewForm(this.formGroup.value)
      .pipe(finalize(() => {
        this.formGroup.markAsPristine();
        this.isLoading = false;
      }))
      .subscribe(response => {
        this.router.navigate(['/mitigation/actions'], { replaceUrl: true });
        
      }, error => {
        log.debug(`New Mitigation Action Form error: ${error}`);
        this.error = error;
      });

  }

  private createForm() {
    this.formGroup = this.formBuilder.group({
      formArray: this.formBuilder.array([

        this.formBuilder.group({
          programCtrl: ['', Validators.required],
          nameCtrl: ['', Validators.required],
          entityCtrl: ['', Validators.required],
        }),
        this.formBuilder.group({
          contactNameCtrl: ['', Validators.required],
          positionCtrl: ['', Validators.required],
          emailFormCtrl: ['', Validators.email],
          phoneCtrl: ['', Validators.required],
        }),
        this.formBuilder.group({
          actionObjectiveCtrl: ['', Validators.required],
          quantitativeObjectiveCtrl: ['', Validators.required],
          actionStatusCtrl: ['', Validators.required],
          implementationInitialDateCtrl: ['', Validators.required],
          implementationEndDateCtrl: ['', Validators.required],
        }),
        this.formBuilder.group({
          progressIndicatorNameCtrl: ['', Validators.required],
          progressIndicatorTypeCtrl: ['', Validators.required],
          progressIndicatorUnitCtrl: ['', Validators.required],
          progressIndicatorInitialYearCtrl: ['', Validators.required],
        }),
        this.formBuilder.group({
          financingStatusCtrl: ['', Validators.required],
          financingSourceCtrl: ['', Validators.required],
          gasInventoryCtrl: null,
        }),
        this.formBuilder.group({
          afoluIngeiCtrl: null,
          processIngeiCtrl: null,
          wasteIngeiCtrl: null,
        }),
        this.formBuilder.group({
          geographicScaleCtrl: ['', Validators.required],
        }),
        this.formBuilder.group({
          locationNameCtrl: ['', Validators.required],
          gisAnnexedCtrl: ['', Validators.required],
        }),
        this.formBuilder.group({
          emissionSourceCtrl: ['', Validators.required],
          carbonSinksCtrl: ['', Validators.required],
          emissionImpactCtrl: ['', Validators.required],
          mitigationActionImpactCtrl: ['', Validators.required],
          bibliographicalSourcesCtrl: ['', Validators.required],
          internationalParticipationCtrl: ['', Validators.required],
          internationalParticipationDetailCtrl: null,
          sustainabilityObjectivesCtrl: ['', Validators.required]
        }),
      ])
    });
  }

}