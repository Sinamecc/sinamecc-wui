import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PpcnNewFormData, RequiredLevel, RecognitionType, Sector, SubSector , Ovv} from '@app/ppcn/ppcn-new-form-data';
import { finalize, tap } from 'rxjs/operators';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { environment } from '@env/environment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { I18nService, Logger } from '@app/core';
import { PpcnService } from '@app/ppcn/ppcn.service';
import { Ppcn } from '@app/ppcn/ppcn_registry';

const log = new Logger('Report');

@Component({
  selector: 'app-ppcn-update',
  templateUrl: './ppcn-update.component.html',
  styleUrls: ['./ppcn-update.component.scss']
})
export class PpcnUpdateComponent implements OnInit {

  version: string = environment.version;
  error: string;
  isLoading = true;
  isNonLinear = true;
  formGroup: FormGroup;
  ppcn: Observable < Ppcn[] > ;
  processedPpcn: Ppcn[] = [];
  initialRequiredData: Observable < PpcnNewFormData > ;
  contactFormId: number;
  geographicFormId: number;
  requiredFormId: number;
  recognitionFormId: number;
  sectorFormId: number;
  subsectorFormId: number;
  geiOrganizationFormId: number;
  activity_type: string = "";
  ovv_id: string = "";
  emission_OVV: string = "";
  report_date_start: string = "";
  report_date_end: string = "";







  levelId: string = "1";
  levelIdTmp: string = this.levelId;
  id: string;
  formValues: any;
  required_levels: RequiredLevel[];
  recognition_types: RecognitionType[];
  sectors: Sector[];
  subSectors: SubSector[];
  ovvs: Ovv[];

  values$: any;


  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private i18nService: I18nService,
    private service: PpcnService,
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
          nameCtrl: ['', Validators.required],
          representativeNameCtrl: ['', Validators.required],
          telephoneCtrl: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
          faxCtrl: null,
          postalCodeCtrl: null,
          addressCtrl: ['', Validators.required],
          ciuuCodeCtrl: ['', Validators.required],
        }),
        this.formBuilder.group({
          contactNameCtrl: ['', Validators.required],
          positionCtrl: ['', Validators.required],
          emailFormCtrl: ['', Validators.email],
          phoneCtrl: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
        }),
        this.formBuilder.group({
          requiredCtrl: ['', Validators.required],
          recognitionCtrl: ['', Validators.required],
          sectorCtrl: ['', Validators.required],
          subSectorCtrl: ['', Validators.required],
          activityCtrl:['',null],
        }),
        this.formBuilder.group({
          implementationBaseDateCtrl: ['', Validators.required],
          ovvCtrl:null,
          implementationEmissionDateCtrl:null,
          implementationInitialDateCtrl: null,
          implementationEndDateCtrl: null,
        }),
      ])
    });

    this.formValues = forkJoin(
      this.initFormOptions(),
      this.initFormData(),
      (formOptions, formData) => {
        return { formOptions, formData};
      }
    );
  }

  submitForm() {
    this.isLoading = true;

    this.service.submitUpdatePpcnForm(this.formGroup.value,
                                      this.id,
                                      this.contactFormId,
                                      this.geographicFormId,
                                      this.requiredFormId,
                                      this.recognitionFormId,
                                      this.sectorFormId,
                                      this.subsectorFormId, 
                                      this.geiOrganizationFormId)
      .pipe(finalize(() => {
        this.formGroup.markAsPristine();
        this.isLoading = false;
      }))
      .subscribe(response => {
        this.router.navigate([`/ppcn/registries`], { replaceUrl: true });

      }, error => {
        log.debug(`Update PPCN Form error: ${error}`);
        this.error = error;
      });
  }

  private loadFormData(): Observable < Ppcn > {
    return this.service.getPpcn(this.id, this.i18nService.language.split('-')[0])
      .pipe(finalize(() => { this.isLoading = false; }));
  }

  
  
  onSectorChange(newValue: any) {
    this.service.subsectors(String(newValue.value), this.i18nService.language.split('-')[0])
      .subscribe((subsectors: SubSector[]) => {
        this.subSectors = subsectors;
      });

  }

  private initFormOptions(): Observable < PpcnNewFormData > {
    let initialRequiredData = this.initialFormData().pipe(
      tap(ppcnNewFormData => {
        this.isLoading = false;
        this.required_levels = ppcnNewFormData.required_level;
        this.recognition_types = ppcnNewFormData.recognition_type;
        this.sectors = ppcnNewFormData.sector;
        this.subSectors = ppcnNewFormData.subSector;
        this.ovvs = ppcnNewFormData.ovv;
      }));
    return initialRequiredData;
  }

  private initialFormData(): Observable < PpcnNewFormData > {
    return this.service.newPpcnFormData(this.levelId, this.i18nService.language.split('-')[0])
      .pipe(finalize(() => {
        this.isLoading = false;
      }));
  }


  private initFormData(): Observable < Ppcn > {
    let ppcn = this.loadFormData().pipe(
      tap(ppcn => {
        this.levelId = String(ppcn['geographicLevel']['id']);
        this.contactFormId = +ppcn['organization']['contact']['id'];
        this.geographicFormId = +ppcn['geographicLevel']['id'];
        this.requiredFormId = +ppcn['requiredLevel']['id'];
        this.recognitionFormId = +ppcn['recognitionType']['id'];
        this.sectorFormId = +ppcn['sector']['id'];
        this.subsectorFormId = +ppcn['subsector']['id'];
        if(ppcn['gei_organization'] != null){
          this.geiOrganizationFormId = +ppcn['gei_organization']['id'];
          this.activity_type = ppcn['gei_organization']['activity_type'];
          this.ovv_id = String(ppcn['gei_organization']['ovv']['id']);
          this.emission_OVV = ppcn['gei_organization']['emission_OVV'];
          this.report_date_start = ppcn['gei_organization']['report_date_start'];
          this.report_date_end = ppcn['gei_organization']['report_date_end'];

        }
        
        
        let ppcnArray = this.formBuilder.array([
          this.formBuilder.group({
            nameCtrl: [ppcn['organization']['name'], Validators.required],
            representativeNameCtrl: [ppcn['organization']['representative_name'], Validators.required],
            telephoneCtrl: [ppcn['organization']['phone_organization'], Validators.compose([Validators.required, Validators.minLength(8)])],
            faxCtrl: [ppcn['organization']['fax'], null],
            postalCodeCtrl: [ppcn['organization']['postal_code'],null],
            addressCtrl: [ppcn['organization']['address'], Validators.required],
            ciuuCodeCtrl: [ppcn['organization']['ciiu'], Validators.required],
          }),
          this.formBuilder.group({
            contactNameCtrl: [ppcn['organization']['contact']['full_name'], Validators.required],
            positionCtrl: [ppcn['organization']['contact']['job_title'], Validators.required],
            emailFormCtrl: [ppcn['organization']['contact']['email'], Validators.email],
            phoneCtrl: [ppcn['organization']['contact']['phone'], Validators.compose([Validators.required, Validators.minLength(8)])],
          }),
          this.formBuilder.group({
            requiredCtrl: [ppcn['requiredLevel']['id'], Validators.required],
            recognitionCtrl: [ppcn['recognitionType']['id'], Validators.required],
            sectorCtrl: [ppcn['sector']['id'], Validators.required],
            subSectorCtrl: [ppcn['subsector']['id'], Validators.required],
            activityCtrl:[this.activity_type,null],
          }),
          this.formBuilder.group({
            implementationBaseDateCtrl: [ppcn['base_year'], Validators.required],
            ovvCtrl:[this.ovv_id,null],
            implementationEmissionDateCtrl:[this.emission_OVV,null],
            implementationInitialDateCtrl: [this.report_date_start,null],
            implementationEndDateCtrl: [this.report_date_end,null],
          }),
        ]);
        this.formGroup.setControl('formArray', ppcnArray);
      }));
    return ppcn;
  }


}
