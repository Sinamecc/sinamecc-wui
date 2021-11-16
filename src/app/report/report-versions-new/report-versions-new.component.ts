import { Component, OnInit } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { environment } from '@env/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { Logger } from '@core';
import { I18nService } from '@app/i18n';
import { Observable } from 'rxjs';
import { ReportService } from '@app/report/report.service';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';

const log = new Logger('Report');

@Component({
  selector: 'app-report-versions-new',
  templateUrl: './report-versions-new.component.html',
  styleUrls: ['./report-versions-new.component.scss'],
})
export class ReportVersionsNewComponent implements OnInit {
  version: string = environment.version;
  error: string;
  reportForm: FormGroup;
  isLoading = false;
  id: number;
  reportName: Observable<string>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private i18nService: I18nService,
    private reportService: ReportService,
    private translateService: TranslateService,
    public snackBar: MatSnackBar
  ) {
    this.id = +this.route.snapshot.paramMap.get('id');
    this.createForm();
  }

  ngOnInit(): void {}

  submitForm() {
    this.isLoading = true;
    this.reportService
      .submitReportVersion(this.reportForm.value, +this.route.snapshot.paramMap.get('id'))
      .pipe(
        finalize(() => {
          this.reportForm.markAsPristine();
          this.isLoading = false;
        })
      )
      .subscribe(
        (response) => {
          // :id/versions
          this.router.navigate([`/report/${this.route.snapshot.paramMap.get('id')}/versions`], { replaceUrl: true });
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
    this.isLoading = true;
    this.reportService
      .reportVersionsName(this.id)
      .pipe(
        finalize(() => {
          this.reportForm.markAsPristine();
          this.isLoading = false;
        })
      )
      .subscribe(
        (response) => {
          this.reportForm = this.formBuilder.group({
            name: [response, Validators.required],
            file: [{ value: undefined, disabled: false }, []],
          });
        },
        (error) => {
          log.debug(`Report File error: ${error}`);
          this.error = error;
        }
      );
  }
}
