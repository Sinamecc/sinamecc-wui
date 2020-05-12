import { Component, OnInit, ElementRef, ViewChild, Input, AfterViewInit, OnChanges, SimpleChanges, SimpleChange} from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { finalize, tap } from 'rxjs/operators';
import { environment } from '@env/environment';
import { Logger, I18nService, AuthenticationService } from '@app/core';
import { BehaviorSubject } from 'rxjs';
const log = new Logger('Report');

import { PpcnService } from '@app/ppcn/ppcn.service';

import { Observable } from 'rxjs/Observable';

import { PpcnNewFormData, RequiredLevel, RecognitionType } from 'app/ppcn/ppcn-new-form-data';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { MatChipInputEvent } from '@angular/material';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Ppcn } from '../ppcn_registry';
import { Sector } from '../interfaces/sector';
import { SubSector } from '../interfaces/subSector';
import { Ovv } from '../interfaces/ovv';

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


  inventaryResultTable = {
    firstSection : {
      tableHeaderValues : ['ppcn.gasesReport','general.total','CO<sub>2</sub>','CH<sub>4</sub>','N<sub>2</sub>O','PFC','HFC','SF<sub>6</sub>','NF<sub>3</sub>','HCFC','CFC','ppcn.otherGases'],
      tableRows : [
        [{value:'0'},{value:'0'},{value:'0'},{value:'0'},{value:'0'},{value:'0'},{value:'0'},{value:'0'},{value:'0'},{value:'0'},{value:'0'}],
        [{value:'0'},{value:'0'},{value:'0'},{value:'0'},{value:'0'},{value:'0'},{value:'0'},{value:'0'},{value:'0'},{value:'0'},{value:'0'}],
        [{value:'0'},{value:'0'},{value:'0'},{value:'0'},{value:'0'},{value:'0'},{value:'0'},{value:'0'},{value:'0'},{value:'0'},{value:'0'}],
      ]
    },
    secondSection :{
      firsRow : ["ppcn.reportOtherGases",'']
    },
    thirdSection:{
      firsRow : ['ppcn.biogenicEmissions','Total','0'],
      secondRow : ['general.scope',''],
      thirdSection:['general.scope','']
    },
    fourthSection:{
      firsRow:['ppcn.costGHG','0','general.currency','colon'],
      secondRow:['ppcn.verificationOVV','0','general.currency','colon']
    }
  }

  categoryTable = {
    category:['ppcn.organitationCategoryPpcn',''],
    categoryHeader:['ppcn.amountEmissions','ppcn.numberFacilities',
    'ppcn.amountGHG','ppcn.complexityMethodologies'],
    categoryRow:[{value:'0',type:'number'},{value:'0',type:'number'},{value:'0',type:'number'},{value:'',type:'text'}]
  }

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

    if ((value || '').trim()) {
      this.CIUUCodeList.push(value.trim());
    }

    if (input) {
      input.value = '';
    }

  }

  submitForm(){
    this.isLoading = true;

    let context = {
      context:this.formGroup.value,
      gasReportTable: this.buildTableSection(),
      categoryTable:this.buildCategoryTableSection()
    }
  
    this.formGroup.controls.formArray['controls'][0].patchValue({
      'ciuuListCodeCtrl': this.CIUUCodeList
    })

    this.service.submitNewPpcnForm(context)
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
          confidentialCtrl:(this.levelId=="1"? null:['',Validators.required] ),
          confidentialValueCtrl:(this.levelId=="1"? null:[''] ),
          faxCtrl: '',
          postalCodeCtrl: '',
          addressCtrl: ['', Validators.required],
          legalIdCtrl: (this.levelId=="1"? null:['',Validators.required] ),
          legalRepresentativeIdCtrl: (this.levelId=="1"? null:['',Validators.required] ),
          ciuuCodeCtrl: (this.levelId=="1"? null:[''] ),
          ciuuListCodeCtrl: (this.levelId=="1"? null:['',Validators.required] ),
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
          compensationScheme:(this.levelId=="2"? null:['',Validators.required] ),
          projectLocation:(this.levelId=="2"? null:['',Validators.required] ),
          certificateNumber:(this.levelId=="2"? null:['',Validators.required] ),
          totalCompensation:(this.levelId=="2"? null:['',Validators.required] ),
          compensationCost:(this.levelId=="2"? null:['',Validators.required] ),
          compensationCostValue:(this.levelId=="2"? null:['',Validators.required] ),
          period:(this.levelId=="2"? null:['',Validators.required] ),
          totalEmissionsOffsets:(this.levelId=="2"? null:['',Validators.required] ),
          totalCostCompensation:(this.levelId=="2"? null:['',Validators.required] ),
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
    
    this.formGroup.controls.formArray['controls'][3].patchValue({
      'investmentReductions': 'CRC',
      'totalInvestmentReduction': 'CRC',
    })

    this.formGroup.controls.formArray['controls'][4].patchValue({
      'totalCostCompensation': 'CRC',
      'compensationCost': 'CRC',
    })

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

  showRecognitionFormSection(elementsToShow:number[]){
    return elementsToShow.indexOf(this.reductionFormVar) >= 0
  }

  createActivityForm() : FormGroup{
    return this.formBuilder.group({
      activityCtrl:['',Validators.required],
      sectorCtrl: ['', Validators.required],
      subSectorCtrl: ['', Validators.required],
    })
  }

  addItems(): void {
    const control = <FormArray>this.formGroup.controls.formArray['controls'][6].controls['activities'];
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

  buildTableSection(){
    let gasReport = {};
    let biogenic_emission = {};

    gasReport['other_gases'] = this.inventaryResultTable.secondSection.firsRow[1];

    biogenic_emission['total'] = this.inventaryResultTable.thirdSection.firsRow[2];
    biogenic_emission['scope_1'] = this.inventaryResultTable.thirdSection.secondRow[1];
    biogenic_emission['scope_2'] = this.inventaryResultTable.thirdSection.thirdSection[1];

    gasReport['biogenic_emission'] = biogenic_emission

    gasReport['cost_ghg_inventory'] = this.inventaryResultTable.fourthSection.firsRow[1];
    gasReport['cost_ghg_inventory_currency'] = this.inventaryResultTable.fourthSection.firsRow[3];
    gasReport['cost_ovv_process'] = this.inventaryResultTable.fourthSection.secondRow[1];
    gasReport['cost_ovv_process_currency'] = this.inventaryResultTable.fourthSection.secondRow[3];

    gasReport['gas_scopes'] = this.buildScopeMatrixTable();

    return gasReport;
  }

  buildCategoryTableSection(){
    let organitationCategory = {};
    organitationCategory['organization_category'] = this.categoryTable.category[1];
    organitationCategory['emission_quantity'] = this.categoryTable.categoryRow[0].value;
    organitationCategory['buildings_number'] = this.categoryTable.categoryRow[1].value;
    organitationCategory['data_inventory_quantity'] = this.categoryTable.categoryRow[2].value;
    organitationCategory['methodologies_complexity'] = this.categoryTable.categoryRow[3].value;

    console.log(organitationCategory);
    return organitationCategory;
  }

  buildScopeMatrixTable(){
    let gasScopes = []
    let i = 0
    for(let row of this.inventaryResultTable.firstSection.tableRows){
      let j = 0
      let scope = {}
      let quantifiedGases = []
      scope['name'] = `scope_${i+1}`
      for(let column of row){
        let gas = {
          name:this.inventaryResultTable.firstSection.tableHeaderValues[j].replace('<sub>','').replace('</sub>',''),
          value:column.value,
        }
        j += 1;
        quantifiedGases.push(gas);
      }
      scope['quantified_gases'] = quantifiedGases;
      gasScopes.push(scope);
      i +=1 ;
    }

    return gasScopes;
  }



}
