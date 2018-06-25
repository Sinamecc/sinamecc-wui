import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { environment } from '@env/environment';
import { Logger, I18nService, AuthenticationService } from '@app/core';

const log = new Logger('Report');


import { ReportService } from './../report.service';
import { MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-report-new',
  templateUrl: './report-new.component.html',
  styleUrls: ['./report-new.component.scss']
})
export class ReportNewComponent implements OnInit {

  version: string = environment.version;
  error: string;
  reportForm: FormGroup;
  isLoading = false;

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private i18nService: I18nService,
    private reportService: ReportService,
    private translateService: TranslateService,
    public snackBar: MatSnackBar) {
    this.createForm();
  }

  ngOnInit() {}

  submitForm() {
    this.isLoading = true;
    this.reportService.submitReport(this.reportForm.value)
      .pipe(finalize(() => {
        this.reportForm.markAsPristine();
        this.isLoading = false;
      }))
      .subscribe(response => {
        this.router.navigate(['/report'], { replaceUrl: true });
        this.translateService.get('Sucessfully submitted form').subscribe((res: string) => { this.snackBar.open(res); });
        log.debug(`${response.statusCode} status code received from form`);

      }, error => {
        log.debug(`Report File error: ${error}`);
        this.error = error;
      });
  }

  private createForm() {
    this.reportForm = this.formBuilder.group({
      name: ['', Validators.required],
      file: [{ value: undefined, disabled: false }, []],
    });
  }

}