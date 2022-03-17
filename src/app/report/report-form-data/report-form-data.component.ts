import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';

import { Logger } from '@core';
import { I18nService } from '@app/i18n';
import { environment } from '@env/environment';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ReportService, Report } from '@app/report/report.service';
import { ReportDataCatalog } from '../interfaces/report-data';
import { ReportDataPayload } from '../interfaces/report-data-payload';

@Component({
  selector: 'app-report-form-data',
  templateUrl: './report-form-data.component.html',
  styleUrls: ['./report-form-data.component.scss'],
})
export class ReportFormDataComponent implements OnInit {
  transferMethodToInstitutions = 'example: email, web page, REST API Call, SFTP, FTP, WeTransfer, other.';
  version: string = environment.version;
  error: string;
  reportForm: FormGroup;
  isLoading = false;
  methodological = false;
  catalogs: ReportDataCatalog = undefined;
  @Input() mainStepper: any;

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
  }

  submitForm() {
    this.reportForm.value.methodological = this.methodological.toString();
    this.isLoading = true;
    const payload = this.buildForm();
    this.translateService.get('sucessfullySubmittedForm').subscribe((res: string) => {
      this.snackBar.open(res, null, { duration: 3000 });
      this.mainStepper.next();
    });

    /*
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
      */
  }

  private buildForm() {
    const payload: ReportDataPayload = {
      other_classifier: '',
      report_information: this.reportForm.value['formArray'][0].whatInformationReportedCtrl,
      have_line_base: this.reportForm.value['formArray'][0].isBaselineCtrl,
      have_quality_element: this.reportForm.value['formArray'][0].qualityPreItemsCtrl,
      quality_element_description: this.reportForm.value['formArray'][0].qualityPreItemsValueCtrl,
      transfer_data_with_sinamecc: this.reportForm.value['formArray'][0].agreementTransferSINAMECCCtrl,
      transfer_data_with_sinamecc_description: this.reportForm.value['formArray'][0].agreementTransferSINAMECCValueCtrl,
      // isBaselineValueCtrlFile: this.reportForm.value['formArray'][0].isBaselineValueCtrlFile,
      // isBaselineValueCtrlValue: this.reportForm.value['formArray'][0].isBaselineValueCtrlValue,
      // reportDataCtrlFile: this.reportForm.value['formArray'][0].reportDataCtrlFile,
      // reportDataCtrlValue: this.reportForm.value['formArray'][0].reportDataCtrlValue,
    };

    return payload;
  }

  public validOptions() {
    const isqualityPreItemsCtrl = this.reportForm.value['formArray'][0].qualityPreItemsCtrl;
    const validqualityPreItemsCtrl = isqualityPreItemsCtrl
      ? this.reportForm.value['formArray'][0].qualityPreItemsValueCtrl !== ''
        ? true
        : false
      : true;

    const agreementTransferSINAMECCCtrl = this.reportForm.value['formArray'][0].agreementTransferSINAMECCCtrl;
    const validAgreementTransferSINAMECCCtrl = agreementTransferSINAMECCCtrl
      ? this.reportForm.value['formArray'][0].agreementTransferSINAMECCValueCtrl !== ''
        ? true
        : false
      : true;

    const isBaselineCtrl = this.reportForm.value['formArray'][0].isBaselineCtrl;
    const validIsBaselineCtrl = isBaselineCtrl
      ? this.reportForm.value['formArray'][0].isBaselineValueCtrlFile !== '' ||
        this.reportForm.value['formArray'][0].isBaselineValueCtrlValue !== ''
      : true;

    const validReportData =
      this.reportForm.value['formArray'][0].reportDataCtrlFile !== '' ||
      this.reportForm.value['formArray'][0].reportDataCtrlValue !== ''
        ? true
        : false;

    return (
      validIsBaselineCtrl &&
      validReportData &&
      validqualityPreItemsCtrl &&
      validAgreementTransferSINAMECCCtrl &&
      this.reportForm.valid
    );
  }

  private createForm() {
    this.reportForm = this.formBuilder.group({
      formArray: this.formBuilder.array([
        this.formBuilder.group({
          whatInformationReportedCtrl: ['', Validators.required],
          isBaselineCtrl: [false, Validators.compose([Validators.maxLength(500), Validators.required])],
          isBaselineValueCtrlFile: [''], // new Field
          isBaselineValueCtrlValue: [''], // new Field
          qualityPreItemsCtrl: ['', Validators.required],
          qualityPreItemsValueCtrl: ['', Validators.compose([Validators.maxLength(500), Validators.required])],
          agreementTransferSINAMECCCtrl: ['', Validators.required],
          agreementTransferSINAMECCValueCtrl: [
            '',
            Validators.compose([Validators.maxLength(500), Validators.required]),
          ],
          reportDataCtrlFile: [''], // new Field
          reportDataCtrlValue: [''], // new Field
        }),
      ]),
    });
  }
}
