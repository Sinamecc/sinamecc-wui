import { Component, OnInit, ElementRef, ViewChild, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize, map, tap } from 'rxjs/operators';

import { environment } from '@env/environment';
import { Logger, I18nService, AuthenticationService } from '@app/core';
import { MitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service';
import { MitigationActionNewFormData, FinanceSourceType } from '@app/mitigation-actions/mitigation-action-new-form-data';
import { Institution } from '@app/mitigation-actions/mitigation-action-new-form-data';
import { Status } from '@app/mitigation-actions/mitigation-action-new-form-data';
import { IngeiCompliance } from '@app/mitigation-actions/mitigation-action-new-form-data';
import { GeographicScale } from '@app/mitigation-actions/mitigation-action-new-form-data';

import { Observable } from 'rxjs/Observable';
import { MatSelectChange } from '@angular/material/select';

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
  initalRequiredData: Observable<MitigationActionNewFormData>;
  
  startDate = new Date(1990, 0, 1);
  institutions: Institution[];
  ingeis: IngeiCompliance[];
  statusses: Status[];
  geographicScales: GeographicScale[];
  financeSourceTypes: FinanceSourceType[];
  displayFinancialSource: Boolean;
  registrationTypeId:string;


  get formArray(): AbstractControl | null { return this.formGroup.get('formArray'); }

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private i18nService: I18nService,
    private service: MitigationActionsService) {
    this.createForm();
  }

  ngOnInit() { }

  submitForm() {
    this.isLoading = true;


    this.service.submitMitigationActionNewForm(this.formGroup.value, this.registrationTypeId)
      .pipe(finalize(() => {
        this.formGroup.markAsPristine();
        this.isLoading = false;
      }))
      .subscribe(response => {
        // this.router.navigate([`/mitigation/actions/${response.id}/harmonization/integration`], { replaceUrl: true });
        this.router.navigate([`/mitigation/actions`], { replaceUrl: true });
      }, error => {
        log.debug(`New Mitigation Action Form error: ${error}`);
        this.error = error;
      });

  }

  activateInsured(id: number): void {
    this.displayFinancialSource = id != 1 
  }

  private createForm() {
    this.formGroup = this.formBuilder.group({
      formArray: this.formBuilder.array([
        this.formBuilder.group({
          programCtrl: ['', Validators.required],
          nameCtrl: ['', Validators.required],
          entityCtrl: ['', Validators.required],
          uccCtrl: null,
          ovvCtrl: ['', Validators.required],
        }),
        this.formBuilder.group({
          contactNameCtrl: ['', Validators.required],
          positionCtrl: ['', Validators.required],
          emailFormCtrl: ['', Validators.email],
          phoneCtrl: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
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
          financingSourceCtrl: null,
          gasInventoryCtrl: null,
        }),
        this.formBuilder.group({
          ingeiComplianceCtrl: null,
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

    this.initalRequiredData = this.initialFormData().pipe(
      tap(mitigationActionNewFormData => {
        this.isLoading = false;
        this.registrationTypeId = mitigationActionNewFormData.registration_types[0].id
        this.institutions = mitigationActionNewFormData.institutions;
        this.statusses = mitigationActionNewFormData.statuses;
        this.ingeis = mitigationActionNewFormData.ingei_compliances;
        this.geographicScales = mitigationActionNewFormData.geographic_scales;
        this.financeSourceTypes = mitigationActionNewFormData.finance_source_types;
      }));
  }

  private initialFormData():Observable<MitigationActionNewFormData> {
    return this.service.newMitigationActionFormData(this.i18nService.language.split('-')[0], 'new')
    .pipe(finalize(() => { this.isLoading = false; }));

  }

  financialSourceInputShown($event:any) {
    // todo: when we traslate in the backend we need to traslate this hardcoded value here
    const insuredSourceTypeId = this.financeSourceTypes.filter(financeSource => financeSource.name == 'Asegurado').map(({ id }) => id);
    this.displayFinancialSource = $event.value == insuredSourceTypeId;
  }

}