import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { environment } from '@env/environment';
import { Logger, I18nService, AuthenticationService } from '@app/core';
import { tap } from 'rxjs/operators';

const log = new Logger('Report');


import { MitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material';
import { MitigationAction } from '@app/mitigation-actions/mitigation-action';

@Component({
  selector: 'app-conceptual-integration-new',
  templateUrl: './conceptual-integration-new.component.html',
  styleUrls: ['./conceptual-integration-new.component.scss']
})
export class ConceptualIntegrationNewComponent implements OnInit {

  version: string = environment.version;
  error: string;
  form: FormGroup;
  isLoading = false;
  id: string;
  mitigationAction: MitigationAction;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private i18nService: I18nService,
    private service: MitigationActionsService,
    private translateService: TranslateService,
    public snackBar: MatSnackBar) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.createForm();
  }

  ngOnInit() {
  }


  submitForm() {
    this.isLoading = true;
    this.service.submitNewConceptualIntegration(this.form.value)
      .pipe(finalize(() => {
        this.form.markAsPristine();
        this.isLoading = false;
      }))
      .subscribe(response => {
        // :id/versions
        //this.router.navigate([`/mitig/${this.route.snapshot.paramMap.get('id')}/versions`], { replaceUrl: true });
        this.router.navigate([`mitigation/actions`], { replaceUrl: true });
        this.translateService.get('Sucessfully submitted form').subscribe((res: string) => { this.snackBar.open(res); });
        log.debug(`${response.statusCode} status code received from form`);

      }, error => {
        log.debug(`Report File error: ${error}`);
        this.error = error;
      });
  }

  private createForm() {
    this.isLoading = true;

    this.service.getMitigationAction(this.id, this.i18nService.language.split('-')[0])
    .pipe(finalize(() => {
      this.form.markAsPristine();
      this.isLoading = false;
    }))
    .subscribe(response => {
      this.mitigationAction = response;
      this.form = this.formBuilder.group({
        commentCtrl: ['', Validators.required],
        mitigationActionCtrl: [response['id'], Validators.required],
        fileCtrl: [{ value: undefined, disabled: false }, []],
      });
    }, error => {
      log.debug(`Conceptual Integration Proposal New Form File error: ${error}`);
      this.error = error;
    });

  }

}
