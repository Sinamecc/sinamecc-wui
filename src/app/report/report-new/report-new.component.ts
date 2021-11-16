import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Logger } from '@core';
import { I18nService } from '@app/i18n';
import { environment } from '@env/environment';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';

import { ReportService, Report } from '@app/report/report.service';

const log = new Logger('Report');

@Component({
  selector: 'app-report-new',
  templateUrl: './report-new.component.html',
  styleUrls: ['./report-new.component.scss'],
})
export class ReportNewComponent implements OnInit {
  transferMethodToInstitutions = 'example: email, web page, REST API Call, SFTP, FTP, WeTransfer, other.';
  version: string = environment.version;
  error: string;
  reportForm: FormGroup;
  isLoading = false;
  methodological = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private i18nService: I18nService,
    private reportService: ReportService,
    private translateService: TranslateService,
    public snackBar: MatSnackBar
  ) {
    this.createForm();
  }

  ngOnInit(): void {}

  checkCheckBoxvalue(value: boolean) {
    this.methodological = value;
  }

  submitForm() {
    this.reportForm.value.methodological = this.methodological.toString();
    this.isLoading = true;
    this.reportService
      .submitReport(this.reportForm.value)
      .pipe(
        finalize(() => {
          this.reportForm.markAsPristine();
          this.isLoading = false;
        })
      )
      .subscribe(
        (response) => {
          this.router.navigate(['/report'], { replaceUrl: true });
          this.translateService.get('sucessfullySubmittedForm').subscribe((res: string) => {
            this.snackBar.open(res, null, { duration: 3000 });
          });
          log.debug(`${response.statusCode} status code received from form`);
        },
        (error) => {
          log.debug(`Report File error: ${error}`);
          this.error = error;
        }
      );
  }

  private createForm() {
    this.reportForm = this.formBuilder.group({
      name: ['', Validators.required],
      file: [{ value: undefined, disabled: false }, []],
      institution: [''],
      department: [''],
      personName: [''],
      personLastName: [''],
      personEmail: [''],
      sent: [this.transferMethodToInstitutions],
      updatePeriod: [''],
      methodological: [''],
    });
  }
}
