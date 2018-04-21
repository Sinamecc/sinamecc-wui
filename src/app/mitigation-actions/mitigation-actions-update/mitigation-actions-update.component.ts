import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize, tap } from 'rxjs/operators';

import { environment } from '@env/environment';
import { Logger, I18nService, AuthenticationService } from '@app/core';
import { MitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service';
import { MitigationActionNewFormData, GeographicScale, Status, IngeiCompliance, Institution } from '@app/mitigation-actions/mitigation-action-new-form-data';
import { MitigationAction } from '@app/mitigation-actions/mitigation-action';
import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin';


const log = new Logger('Report');

@Component({
  selector: 'app-mitigation-actions-update',
  templateUrl: './mitigation-actions-update.component.html',
  styleUrls: ['./mitigation-actions-update.component.scss']
})
export class MitigationActionsUpdateComponent implements OnInit {
  version: string = environment.version;
  error: string;
  formGroup: FormGroup;
  isLoading = true;
  isNonLinear = true;
  mitigationAction: Observable<MitigationAction>;
  initalRequiredData: Observable<MitigationActionNewFormData>;
  contactFormId: number;
  locationFormId: number;
  progressIndicatorFormId: number;
  financeFormId: number;

  startDate = new Date(1990, 0, 1);
  id: string;
  institutions: Institution[];
  ingeis: IngeiCompliance[];
  statusses: Status[];
  geographicScales: GeographicScale[];
  formValues: any;
  
  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private i18nService: I18nService,
    private service: MitigationActionsService,
    private route: ActivatedRoute) {
      this.id = this.route.snapshot.paramMap.get('id');
      this.createForm();
     }

  ngOnInit() {
    
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

    this.formValues = forkJoin(
      this.initFormOptions(),
      this.initFormData(),    
      (formOptions, formData) => { 
        return { formOptions, formData };
      }
    );
  }


  submitForm() {
    this.isLoading = true;
    this.service.submitMitigationActionUpdateForm(this.formGroup.value, 
                                                  this.id, 
                                                  this.contactFormId, 
                                                  this.progressIndicatorFormId, 
                                                  this.financeFormId, 
                                                  this.locationFormId)
      .pipe(finalize(() => {
        this.formGroup.markAsPristine();
        this.isLoading = false;
      }))
      .subscribe(response => {
        this.router.navigate(['/mitigation/actions'], { replaceUrl: true });
        
      }, error => {
        log.debug(`Update Mitigation Action Form error: ${error}`);
        this.error = error;
      });

  }
  private loadFormData():Observable<MitigationAction> {

    return this.service.getMitigationAction(this.id)
    .pipe(finalize(() => { this.isLoading = false; }));
  }

  private initialFormData():Observable<MitigationActionNewFormData> {
    return this.service.newMitigationActionFormData()
    .pipe(finalize(() => { this.isLoading = false; }));

  }
  

  private parseBoolean(input: string) {
    let result;
    if(input) {
      result = '1';
    } else {
      result = '0';
    }
    return result;
    
  }

  private initFormOptions():Observable<MitigationActionNewFormData> {
    let initialRequiredData = this.initialFormData().pipe(
      tap(mitigationActionNewFormData => {
        this.isLoading = false;
        this.institutions = mitigationActionNewFormData.institutions;
        this.statusses = mitigationActionNewFormData.statuses;
        this.ingeis = mitigationActionNewFormData.ingei_compliances;
        this.geographicScales = mitigationActionNewFormData.geographic_scales;
      }));
      return initialRequiredData;
  }

  private initFormData():Observable<MitigationAction> {
    let mitigationAction = this.loadFormData().pipe(
      tap(mitigationAction => {
        //console.log('Here we fill the form with', mitigationAction);

        this.contactFormId = +mitigationAction['contact']['id'];
        this.progressIndicatorFormId = +mitigationAction['progress_indicator']['id'];
        this.locationFormId = +mitigationAction['location']['id'];
        this.financeFormId = +mitigationAction['finance']['id'];
        let mitigationActionArray = this.formBuilder.array([
          this.formBuilder.group({
            programCtrl: [mitigationAction['strategy_name'], Validators.required],
            nameCtrl: [mitigationAction['name'], Validators.required],
            entityCtrl: [mitigationAction['institution']['id'], Validators.required],
          }),
          this.formBuilder.group({
            contactNameCtrl: [mitigationAction['contact']['full_name'], Validators.required],
            positionCtrl: [mitigationAction['contact']['job_title'], Validators.required],
            emailFormCtrl: [mitigationAction['contact']['email'], Validators.email],
            phoneCtrl: [mitigationAction['contact']['phone'], Validators.required],
          }),
          this.formBuilder.group({
            actionObjectiveCtrl: [mitigationAction['purpose'], Validators.required],
            quantitativeObjectiveCtrl: [mitigationAction['quantitative_purpose'], Validators.required],
            actionStatusCtrl: [mitigationAction['status']['id'], Validators.required],
            implementationInitialDateCtrl: [mitigationAction['start_date'], Validators.required],
            implementationEndDateCtrl: [mitigationAction['end_date'], Validators.required],
          }),
          this.formBuilder.group({
            progressIndicatorNameCtrl: [mitigationAction['progress_indicator']['name'], Validators.required],
            progressIndicatorTypeCtrl: [mitigationAction['progress_indicator']['type'], Validators.required],
            progressIndicatorUnitCtrl: [mitigationAction['progress_indicator']['unit'], Validators.required],
            progressIndicatorInitialYearCtrl: [mitigationAction['progress_indicator']['start_date'], Validators.required],
          }),
          this.formBuilder.group({
            financingStatusCtrl: [1, Validators.required],
            financingSourceCtrl: [mitigationAction['finance']['source'], Validators.required],
            gasInventoryCtrl: mitigationAction['gas_inventory'],
          }),
          this.formBuilder.group({
            ingeiComplianceCtrl: [mitigationAction['ingei_compliances'].map((ingei_compliance:IngeiCompliance) => ingei_compliance.id), Validators.required],
          }),
          this.formBuilder.group({
            geographicScaleCtrl: [mitigationAction['geographic_scale']['id'], Validators.required],
          }),
          this.formBuilder.group({
            locationNameCtrl: [mitigationAction['location']['geographical_site'], Validators.required],
            gisAnnexedCtrl: [this.parseBoolean(mitigationAction['location']['is_gis_annexed']), Validators.required],
          }),
          this.formBuilder.group({
            emissionSourceCtrl: [mitigationAction['emissions_source'], Validators.required],
            carbonSinksCtrl: [mitigationAction['carbon_sinks'], Validators.required],
            emissionImpactCtrl: [mitigationAction['impact'], Validators.required],
            mitigationActionImpactCtrl: [mitigationAction['impact_plan'], Validators.required],
            bibliographicalSourcesCtrl: [mitigationAction['bibliographic_sources'], Validators.required],
            internationalParticipationCtrl: [this.parseBoolean(mitigationAction['is_international']), Validators.required],
            internationalParticipationDetailCtrl: mitigationAction['international_participation'],
            sustainabilityObjectivesCtrl: [mitigationAction['sustainability'], Validators.required]
          }),
        ]);
        this.formGroup.setControl('formArray', mitigationActionArray);
      }));
      return mitigationAction;
  }

  compareIds(id1: any, id2: any): boolean {
    const a1 = determineId(id1);
    const a2 = determineId(id2);
    return a1 === a2;
  }

}

export function determineId(id: any): string {
  if (id.constructor.name === 'array' && id.length > 0) {
     return '' + id[0];
  }
  return '' + id;
}