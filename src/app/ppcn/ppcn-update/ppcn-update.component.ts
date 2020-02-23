import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { PpcnNewFormData, RequiredLevel, RecognitionType, Sector, SubSector , Ovv} from '@app/ppcn/ppcn-new-form-data';
import { finalize, tap } from 'rxjs/operators';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { environment } from '@env/environment';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
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
  activity_type = '';
  ovv_id = '';
  emission_OVV = '';
  report_date_start = '';
  report_date_end = '';
  levelId = '1';
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

        }),
        this.formBuilder.group({
          baseYearCtrl: ['', Validators.required],
          reportYearCtrl: ['', Validators.required],
          ovvCtrl: ['', Validators.required],
          implementationEmissionDateCtrl: null,
          implementationInitialDateCtrl: null,
          implementationEndDateCtrl: null,
        }),
        this.formBuilder.group({
          activities: this.formBuilder.array([ this.createActivityForm() ]),
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

  createActivityForm(): FormGroup {
    return this.formBuilder.group({
      activityCtrl: ['', Validators.required],
      sectorCtrl: ['', Validators.required],
      subSectorCtrl: ['', Validators.required],
    });
  }
  loadActivityForm(ppcn: any): FormGroup {
    return this.formBuilder.group({
      activityCtrl: [ppcn['gei_organization']['gei_activity_types']['0']['activity_type']],
      sectorCtrl: [ppcn['gei_organization']['gei_activity_types']['0']['sector']],
      subSectorCtrl: [ppcn['gei_organization']['gei_activity_types']['0']['sub_sector']],
    });
  }
  addItems(): void {
    const control = <FormArray>this.formGroup.controls.formArray['controls'][4].controls['activities'];
    control.push(this.createActivityForm());
  }

  deleteItems(i: number): void {
    const control = <FormArray>this.formGroup.controls.formArray['controls'][4].controls['activities'];
    control.removeAt(i);
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
    const initialRequiredData = this.initialFormData().pipe(
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
    const ppcn = this.loadFormData().pipe(
      tap(resolvedPpcn => {
        this.levelId = String(resolvedPpcn['geographic_level']['id']);
        this.contactFormId = +resolvedPpcn['organization']['contact']['id'];
        this.geographicFormId = +resolvedPpcn['geographic_level']['id'];
        this.requiredFormId = +resolvedPpcn['required_level']['id'];
        this.recognitionFormId = +resolvedPpcn['recognition_type']['id'];
        if (resolvedPpcn['gei_organization'] != null) {
          this.geiOrganizationFormId = +resolvedPpcn['gei_organization']['id'];
          this.ovv_id = String(resolvedPpcn['gei_organization']['ovv']['id']);
          this.emission_OVV = resolvedPpcn['gei_organization']['emission_OVV'];
          this.report_date_start = resolvedPpcn['gei_organization']['report_date_start'];
          this.report_date_end = resolvedPpcn['gei_organization']['report_date_end'];
          this.sectorFormId = +resolvedPpcn['gei_organization']['gei_activity_types']['0']['sector']['id'];
          this.subsectorFormId = resolvedPpcn['gei_organization']['gei_activity_types']['0']['sub_sector']['id'];
          this.activity_type = resolvedPpcn['gei_organization']['gei_activity_types']['0']['activity_type'];

        }


        const ppcnArray = this.formBuilder.array([
          this.formBuilder.group({
            nameCtrl: [ppcn['organization']['name'], Validators.required],
            representativeNameCtrl: [ppcn['organization']['representative_name'], Validators.required],
            telephoneCtrl: [ppcn['organization']['phone_organization'], Validators.compose([Validators.required, Validators.minLength(8)])],
            faxCtrl: [ppcn['organization']['fax'], null],
            postalCodeCtrl: [ppcn['organization']['postal_code'], null],
            addressCtrl: [ppcn['organization']['address'], Validators.required],
            ciuuCodeCtrl: [ppcn['organization']['ciiu'], Validators.required],
          }),
          this.formBuilder.group({
            contactNameCtrl: [ppcn['organization']['contact']['full_name'], Validators.required],
            positionCtrl: [ppcn['organization']['contact']['job_title'], Validators.required],
            emailFormCtrl: [ppcn['organization']['contact']['email'], Validators.email],
            phoneCtrl: [ppcn['organization']['contact']['phone'],
                        Validators.compose([Validators.required, Validators.minLength(8)])],
          }),
          this.formBuilder.group({
            requiredCtrl: [ppcn['required_level']['id'], Validators.required],
            recognitionCtrl: [ppcn['recognition_type']['id'], Validators.required],
          }),
          this.formBuilder.group({
            baseYearCtrl: [ppcn['gei_organization']['base_year'], Validators.required],
            reportYearCtrl: [ppcn['gei_organization']['report_year'], Validators.required],
            ovvCtrl: [ppcn['gei_organization']['ovv'], Validators.required],
            implementationEmissionDateCtrl: [ppcn['gei_organization']['emission_ovv_date'], Validators.required],
          }),
          this.formBuilder.group({
            activities: this.formBuilder.array([ this.loadActivityForm(ppcn) ]),
          }),
        ]);
        this.formGroup.setControl('formArray', ppcnArray);
      }));
    return ppcn;
  }


}
