import { Component, OnInit, ElementRef, ViewChild, Input, AfterViewInit, OnChanges, SimpleChanges, SimpleChange} from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { finalize, tap } from 'rxjs/operators';
import { environment } from '@env/environment';
import { Logger, I18nService, AuthenticationService } from '@app/core';
import { BehaviorSubject } from 'rxjs';
const log = new Logger('Report');

import { PpcnService } from '@app/ppcn/ppcn.service';
import { Ppcn, GeographicLevel, Sector, SubSector } from '@app/ppcn/ppcn_registry';
import { Observable } from 'rxjs/Observable';

import { PpcnNewFormData, RequiredLevel, RecognitionType } from 'app/ppcn/ppcn-new-form-data';
import { forkJoin } from 'rxjs/observable/forkJoin';

@Component({
  selector: 'app-ppcn-new',
  templateUrl: './ppcn-new.component.html',
  styleUrls: ['./ppcn-new.component.scss']
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

  required_levels: RequiredLevel[];
  recognition_types: RecognitionType[];
  sectors: Sector[];
  subSectors: SubSector[];

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
          faxCtrl: null,
          postalCodeCtrl:null,
          addressCtrl: ['', Validators.required],
          ciuuCodeCtrl: (this.levelId=="1"? null:['',Validators.required] )
        }),
        this.formBuilder.group({
          contactNameCtrl: ['', Validators.required],
          positionCtrl: ['', Validators.required],
          emailFormCtrl: ['', Validators.email],
          phoneCtrl: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
        }),
        this.formBuilder.group({
          requiredCtrl:['', Validators.required],
          recognitionCtrl: ['',Validators.required],
          sectorCtrl: ['', Validators.required],
          subSectorCtrl: ['', Validators.required],
        }),
        this.formBuilder.group({
          implementationEndDateCtrl:['', Validators.required],
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
    });

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
