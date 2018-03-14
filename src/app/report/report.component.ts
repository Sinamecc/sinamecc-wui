import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { environment } from '@env/environment';
import { Logger, I18nService, AuthenticationService } from '@app/core';

const log = new Logger('Report');


import { ReportService } from './report.service';


@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  version: string = environment.version;
  error: string;
  reportForm: FormGroup;
  isLoading = false;

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private i18nService: I18nService,
    private reportService: ReportService) {
    this.createForm();
  }

  ngOnInit() { }

  submitForm() {
    this.isLoading = true;
    this.reportService.submitReport(this.reportForm.value)
      .pipe(finalize(() => {
        this.reportForm.markAsPristine();
        this.isLoading = false;
      }))
      .subscribe(response => {
        log.debug(`${response.statusCode} status code received from form`);

      }, error => {
        log.debug(`Login error: ${error}`);
        this.error = error;
      });
  }

  private createForm() {
    this.reportForm = this.formBuilder.group({
      name: ['', Validators.required],
      reportfile: [{ value: undefined, disabled: false }, []],
    });
  }

}
