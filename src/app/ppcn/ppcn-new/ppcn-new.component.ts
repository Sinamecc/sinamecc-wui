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
      geographicCtrl: ['', Validators.required]
    });
    this.ppcn = this.initialFormData().pipe(
      tap((ppcn: Ppcn[]) => { this.processedPpcn = ppcn; })
    );
    //this.initialFormData();
  }

  private initialFormData(): Observable<Ppcn[]> {
    return this.service.ppcn(this.i18nService.language.split('-')[0])
    .pipe(finalize(() => { this.isLoading = false; }));
  }

}
