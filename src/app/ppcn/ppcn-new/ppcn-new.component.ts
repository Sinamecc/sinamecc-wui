import { Component, OnInit, ElementRef, ViewChild, Input} from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { finalize, tap } from 'rxjs/operators';
import { environment } from '@env/environment';
import { Logger, I18nService, AuthenticationService } from '@app/core';

const log = new Logger('Report');

import { PpcnService } from '@app/ppcn/ppcn.service';
import { Ppcn, GeographicLevel } from '@app/ppcn/ppcn_registry';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material';
import { PpcnFlowComponent } from 'app/ppcn/ppcn-flow/ppcn-flow.component';
import { PpcnLevelComponent } from 'app/ppcn/ppcn-level/ppcn-level.component';
import { PpcnNewFormData, RequiredLevel, RecognitionType, Sector, SubSector } from 'app/ppcn/ppcn-new-form-data';

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

  requiredLevel: RequiredLevel[];
  recognitionType: RecognitionType[];
  sector: Sector[];
  subSector: SubSector[];
  

  get formArray(): AbstractControl | null { return this.formGroup.get('formArray'); }

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private i18nService: I18nService,
    private service: PpcnService) {
    this.createForm();
  }

  ngOnInit() {
  }

  private createForm(){
    this.formGroup = this.formBuilder.group({
      formArray: this.formBuilder.array([
        this.formBuilder.group({
          nameCtrl: ['', Validators.required],
          representativeNameCtrl: ['', Validators.required],
          telephoneCtrl: ['', Validators.required],
          faxCtrl: null,
          postalCodeCtrl:null,
          addressCtrl: ['', Validators.required] 
        }),
      ])
    });

    this.initialRequiredData = this.initialFormData().pipe(
      tap(ppcnNewFormData => {
        this.isLoading = false;
        this.requiredLevel = ppcnNewFormData[0].requiredLevel;
        this.recognitionType = ppcnNewFormData[0].recognitionType;
        this.sector = ppcnNewFormData[0].sector;
        this.subSector = ppcnNewFormData[0].subSector;
      }));
  }

  private initialFormData():Observable<PpcnNewFormData> {
    return this.service.newPpcnFormData(this.i18nService.language.split('-')[0])
    .pipe(finalize(() => { this.isLoading = false; }));
  }



}
