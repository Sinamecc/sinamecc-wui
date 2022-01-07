import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';

import { Logger } from '@core';
import { I18nService } from '@app/i18n';
import { environment } from '@env/environment';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';

import { ReportService, Report } from '@app/report/report.service';
import { ReportDataCatalog } from '../interfaces/report-data';
import { ReportDataPayload } from '../interfaces/report-data-payload';

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
  catalogs: ReportDataCatalog = undefined;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private i18nService: I18nService,
    private reportService: ReportService,
    private translateService: TranslateService,
    public snackBar: MatSnackBar
  ) {
    this.createForm();
    this.getCatalogs();
  }

  ngOnInit(): void {}

  checkCheckBoxvalue(value: boolean) {
    this.methodological = value;
  }

  get formArray(): AbstractControl | null {
    return this.reportForm.get('formArray');
  }

  async getCatalogs() {
    this.catalogs = await this.reportService.getReportCatalogs().toPromise();
    console.log(this.catalogs, 'catalogssss');
  }

  submitForm() {
    this.reportForm.value.methodological = this.methodological.toString();
    this.isLoading = true;
    const payload = this.buildForm();

    this.reportService
      .submitReport(payload)
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

  private buildForm() {
    const payload: ReportDataPayload = {
      name: this.reportForm.value['formArray'][0].name,
      description: this.reportForm.value['formArray'][0].dataReportsAnalysisCtrl,
      source: this.reportForm.value['formArray'][0].informationSourcesCtrl,
      //source_file: this.reportForm.value['formArray'][0].file,
      data_type: this.reportForm.value['formArray'][0].dataTypeCtrl,
      other_data_type: this.reportForm.value['formArray'][0].thematicCategorizationCtrl,
      classifier: this.reportForm.value['formArray'][0].sinameccClassifiersCtrl,
      other_classifier: '',
      report_information: this.reportForm.value['formArray'][1].whatInformationReportedCtrl,
      have_line_base: this.reportForm.value['formArray'][1].isBaselineCtrl,
      have_quality_element: this.reportForm.value['formArray'][1].qualityPreItemsCtrl,
      quality_element_description: this.reportForm.value['formArray'][1].qualityPreItemsValueCtrl,
      transfer_data_with_sinamecc: this.reportForm.value['formArray'][1].agreementTransferSINAMECCCtrl,
      transfer_data_with_sinamecc_description: this.reportForm.value['formArray'][1].agreementTransferSINAMECCValueCtrl,
      contact: {
        //institution: 'institution test',
        full_name: this.reportForm.value['formArray'][2].nameCtrl,
        job_title: this.reportForm.value['formArray'][2].positionCtrl,
        email: this.reportForm.value['formArray'][2].emailCtrl,
        phone: this.reportForm.value['formArray'][2].phoneCtrl,
        //"user": 1
      },
      // waiting for BE support Fields
      report_data_change_log: {
        changes: '',
        change_description: '',
      },
    };

    console.log(payload, 'payload');

    return payload;
  }

  private createForm() {
    this.reportForm = this.formBuilder.group({
      formArray: this.formBuilder.array([
        this.formBuilder.group({
          name: ['', Validators.required],
          file: [{ value: undefined, disabled: false }, []],
          dataReportsAnalysisCtrl: ['', Validators.compose([Validators.required, Validators.maxLength(500)])],
          informationSourcesCtrl: ['', Validators.compose([Validators.required, Validators.maxLength(350)])],
          thematicCategorizationCtrl: ['', Validators.compose([Validators.required, Validators.maxLength(500)])],
          dataTypeCtrl: ['', Validators.required],
          sinameccClassifiersCtrl: ['', Validators.required],
        }),
        this.formBuilder.group({
          whatInformationReportedCtrl: ['', Validators.required],
          isBaselineCtrl: [false, Validators.compose([Validators.maxLength(500)])],
          qualityPreItemsCtrl: ['', Validators.required],
          qualityPreItemsValueCtrl: ['', Validators.compose([Validators.maxLength(500)])],
          agreementTransferSINAMECCCtrl: ['', Validators.required],
          agreementTransferSINAMECCValueCtrl: ['', Validators.compose([Validators.maxLength(500)])],
        }),
        this.formBuilder.group({
          nameCtrl: ['', Validators.compose([Validators.required, Validators.maxLength(40)])],
          positionCtrl: ['', Validators.compose([Validators.required, Validators.maxLength(40)])],
          emailCtrl: ['', Validators.compose([Validators.required, Validators.email, Validators.maxLength(40)])],
          phoneCtrl: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
          logsCtrl: ['', Validators.compose([Validators.required, Validators.maxLength(500)])],
        }),
      ]),
    });
  }
}
