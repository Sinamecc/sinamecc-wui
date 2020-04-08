import { Component, OnInit, ElementRef, ViewChild, Input, AfterViewInit, OnChanges, SimpleChanges, SimpleChange} from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { finalize, tap } from 'rxjs/operators';
import { environment } from '@env/environment';
import { Logger, I18nService, AuthenticationService } from '@app/core';
import { BehaviorSubject } from 'rxjs';
const log = new Logger('Report');

import { PpcnService } from '@app/ppcn/ppcn.service';
import { Ppcn, GeographicLevel, Sector, SubSector, Ovv } from '@app/ppcn/ppcn_registry';
import { Observable } from 'rxjs/Observable';

import { PpcnNewFormData, RequiredLevel, RecognitionType } from 'app/ppcn/ppcn-new-form-data';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { MatChipInputEvent } from '@angular/material';
import {COMMA, ENTER} from '@angular/cdk/keycodes';

@Component({
  selector: 'app-ppcn-new',
  templateUrl: './ppcn-new.component.html',
  styleUrls: ['./ppcn-new.component.scss',]
})
export class PpcnNewComponent implements OnInit {
  
  @Input() dataShared:boolean = false;
  
  version: string = environment.version;
  error: string;
  formGroup: FormGroup;
  ppcn: Observable<Ppcn[]>;
  processedPpcn: Ppcn[] = [];
  initialRequiredData: Observable<PpcnNewFormData>;
  isLoading = false;
  levelId = "1";
  levelIdTmp: string = this.levelId;
  activitiesList:FormArray;

  required_levels: RequiredLevel[];
  recognition_types: RecognitionType[];
  sectors: Sector[];
  subSectors: SubSector[];
  ovvs: Ovv[];

  CIUUCodeList:string[] = [];
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  reductionFormVar = 0;

  values$: any;
  

  get formArray(): AbstractControl | null { return this.formGroup.get('formArray'); }

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private i18nService: I18nService,
    private service: PpcnService) {
      this.createForm();
  }

  ngOnInit() {

    this.service.currentLevelId.subscribe(levelId => this.levelId = levelId);
  }

  ngDoCheck()
  {

      if (this.levelId != this.levelIdTmp && this.levelId !== '')
      {
        this.createForm();
        this.levelIdTmp = this.levelId;
      }

  }

  removeCIUUCode(code: string): void {
    const index = this.CIUUCodeList.indexOf(code);

    if (index >= 0) {
      this.CIUUCodeList.splice(index, 1);
    }
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.CIUUCodeList.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    //this.fruitCtrl.setValue(null);
  }

  submitForm(){
    this.isLoading = true;
    
    this.service.submitNewPpcnForm(this.formGroup.value)
      .pipe(finalize(() => {
        this.formGroup.markAsPristine();
        this.isLoading = false;
      }))
      .subscribe(response => {
        this.router.navigate([`/ppcn/${response.id}/download/${response.geographic}`], { replaceUrl: true });
        
      }, error => {
        log.debug(`New PPCN Form error: ${error}`);
        this.error = error;
      });
  }

  private createForm(){
    this.formGroup = this.formBuilder.group({
      formArray: this.formBuilder.array([
        this.formBuilder.group({
          nameCtrl: ['', Validators.required],
          representativeNameCtrl: ['', Validators.required],
          telephoneCtrl: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
          faxCtrl: '',
          postalCodeCtrl: '',
          addressCtrl: ['', Validators.required],
          legalIdCtrl: (this.levelId=="2"? null:['',Validators.required] ),
          provinceCtrl: (this.levelId=="2"? null:['',Validators.required] ),
          cantonCtrl: (this.levelId=="2"? null:['',Validators.required] ),
          distritoCtrl: (this.levelId=="2"? null:['',Validators.required] ),
          legalRepresentativeIdCtrl: (this.levelId=="2"? null:['',Validators.required] ),
          ciuuCodeCtrl: (this.levelId=="1"? null:[''] ),
          ciuuListCodeCtrl: (this.levelId=="2"? null:['',Validators.required] ),
        }),
        this.formBuilder.group({
          contactNameCtrl: ['', Validators.required],
          positionCtrl: ['', Validators.required],
          emailFormCtrl: ['', Validators.email],
          phoneCtrl: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
        }),
        this.formBuilder.group({
          requiredCtrl:['', Validators.required],
          amountOfEmissions:['', Validators.required],
          amountInventoryData:['', Validators.required],
          numberofDacilities:['', Validators.required],
          recognitionCtrl: ['',Validators.required],
        }),
        this.formBuilder.group({
          reductionProjectCtrl:(this.levelId=="2"? null:['',Validators.required] ),
          reductionActivityCtrl:(this.levelId=="2"? null:['',Validators.required] ),
          reductionDetailsCtrl:(this.levelId=="2"? null:['',Validators.required] ),
          reducedEmissionsCtrl:(this.levelId=="2"? null:['',Validators.required] ),
          investmentReductions:(this.levelId=="2"? null:['',Validators.required] ),
          investmentReductionsValue:(this.levelId=="2"? null:['',Validators.required] ),
          totalInvestmentReduction:(this.levelId=="2"? null:['',Validators.required] ),
          totalInvestmentReductionValue:(this.levelId=="2"? null:['',Validators.required] ),
          totalEmisionesReducidas :(this.levelId=="2"? null:['',Validators.required] ),

        }),
        this.formBuilder.group({
          baseYearCtrl:['', Validators.required],
          reportYearCtrl:['',Validators.required],
          ovvCtrl:['',Validators.required],
          implementationEmissionDateCtrl:null,
          implementationInitialDateCtrl: null,
          implementationEndDateCtrl: null,
        }),
        this.formBuilder.group({
          activities: this.formBuilder.array([ this.createActivityForm() ]),
        }),   
      ])
    });

    let subsectors = this.service.subsectors('1',this.i18nService.language.split('-')[0]);
    let initialFormData = this.initialFormData();
    this.values$ = forkJoin([subsectors, initialFormData]).subscribe(results => {
      this.isLoading = false;
      this.subSectors = results[0];
      this.sectors = results[1].sector;
      this.required_levels = results[1].required_level;
      this.recognition_types = results[1].recognition_type;
      this.ovvs = results[1].ovv;
    });

  }
  
  showReductionForm(){
    const validateList = [2,3,4,5];
    if(validateList.indexOf(this.reductionFormVar) >= 0){
      return true;
    }
    return false;
  }
  createActivityForm() : FormGroup{
    return this.formBuilder.group({
      activityCtrl:['',Validators.required],
      sectorCtrl: ['', Validators.required],
      subSectorCtrl: ['', Validators.required],
    })
  }
  addItems(): void {
    const control = <FormArray>this.formGroup.controls.formArray['controls'][4].controls['activities'];
    control.push(this.createActivityForm());
  }

  deleteItems(i:number):void{
    const control = <FormArray>this.formGroup.controls.formArray['controls'][4].controls['activities'];
    control.removeAt(i);
  }

  onSectorChange(newValue:any) {
    this.service.subsectors(String(newValue.value), this.i18nService.language.split('-')[0])
    .subscribe((subsectors: SubSector[]) => { this.subSectors = subsectors; });

  }

  private initialFormData():Observable<PpcnNewFormData> {
    return this.service.newPpcnFormData(this.levelId, this.i18nService.language.split('-')[0])
    .pipe(finalize(() => { this.isLoading = false; }));
  }

}
