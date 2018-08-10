import { Component, OnInit, ElementRef, ViewChild, EventEmitter, Output} from '@angular/core';
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
  selector: 'app-ppcn-level',
  templateUrl: './ppcn-level.component.html',
  styleUrls: ['./ppcn-level.component.scss']
})

export class PpcnLevelComponent implements OnInit {

  @Output() emitEvent:EventEmitter<number> = new EventEmitter<number>();
  
  version: string = environment.version;
  error: string;
  form: FormGroup;
  formData: FormData;
  geographicLevel: Observable<GeographicLevel[]>;
  processedGeographicLevel: GeographicLevel[] = [];
  isLoading = false;

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private i18nService: I18nService,
    private service: PpcnService,
    private translateService: TranslateService,
    public snackBar: MatSnackBar) {
      this.formData = new FormData();
      this.createForm();
     }

  ngOnInit() {
  }

  private createForm() {
    this.form = this.formBuilder.group({
      geographicCtrl: ['', Validators.required]
    });
    this.geographicLevel = this.initialFormData().pipe(
      tap((geographicLevel: GeographicLevel[]) => { this.processedGeographicLevel = geographicLevel; })
    );
  }

  private initialFormData(): Observable<GeographicLevel[]> {
    return this.service.geographicLevel(this.i18nService.language.split('-')[0])
    .pipe(finalize(() => { this.isLoading = false; }));
  }

  onSaving(context:any){
    // console.log(context.geographicCtrl);
    // this.formData.append('geographic',context.geographicCtrl);
    
  }

}