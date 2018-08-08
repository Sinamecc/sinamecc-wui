import { Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
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
import { PpcnNewFormData } from 'app/ppcn/ppcn-new-form-data';

@Component({
  selector: 'app-ppcn-new',
  templateUrl: './ppcn-new.component.html',
  styleUrls: ['./ppcn-new.component.scss']
})
export class PpcnNewComponent implements OnInit {

  version: string = environment.version;
  error: string;
  form: FormGroup;
  ppcn: Observable<Ppcn[]>;
  processedPpcn: Ppcn[] = [];
  initialRequiredData: Observable<PpcnNewFormData>;
  isLoading = false;

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private i18nService: I18nService,
    private service: PpcnService,
    private translateService: TranslateService,
    public snackBar: MatSnackBar) {
      this.createForm();
     }

  ngOnInit() {
  }

  private createForm() {
    this.form = this.formBuilder.group({
      formArray: this.formBuilder.array([
        this.formBuilder.group({
          nameCtrl: ['', Validators.required],
          representativeNameCtrl: ['', Validators.required],
          telephoneCtrl: ['', Validators.required],
          faxCtrl: null,
          postalCodeCtrl: null,
          addressCtrl: ['', Validators.required],
        }),
      ])
    // this.initialRequiredData = this.initialFormData().pipe(
    //   tap((ppcn: Ppcn[]) => { this.processedPpcn = ppcn; })
    // );
    //this.initialFormData();
    });
  }

  // private initialFormData(): Observable<PpcnNewFormData> {
  //   return this.service.newPpcnFormData()
  //   .pipe(finalize(() => { this.isLoading = false; }));
  // 
}
