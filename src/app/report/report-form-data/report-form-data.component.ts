import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';

import { Logger } from '@core';
import { I18nService } from '@app/i18n';
import { environment } from '@env/environment';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ReportService } from '@app/report/report.service';
import { ReportDataCatalog } from '../interfaces/report-data';
import { ReportDataPayload } from '../interfaces/report-data-payload';
import { Report } from '../interfaces/report';

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
  @Input() reportEdit: Report;

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

  ngOnInit(): void {
    this.createUpdatedForm();
  }

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
    this.reportService.updateCurrentReport(payload);
    this.translateService.get('sucessfullySubmittedForm').subscribe((res: string) => {
      this.snackBar.open(res, null, { duration: 3000 });
      this.mainStepper.next();
    });
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
      base_line_report: this.reportForm.value['formArray'][0].isBaselineValueCtrlValue,
      individual_report_data: this.reportForm.value['formArray'][0].reportDataCtrlValue,
      // reportDataCtrlFile: this.reportForm.value['formArray'][0].reportDataCtrlFile,
    };

    return payload;
  }

  public validOptions() {
    if (!this.reportEdit) {
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
    } else {
      return this.reportForm.valid;
    }
  }

  private createForm() {
    this.reportForm = this.formBuilder.group({
      formArray: this.formBuilder.array([
        this.formBuilder.group({
          whatInformationReportedCtrl: ['', Validators.required],
          isBaselineCtrl: [false, Validators.compose([Validators.maxLength(500), Validators.required])],
          isBaselineValueCtrlFile: [''],
          isBaselineValueCtrlValue: [''],
          qualityPreItemsCtrl: ['', Validators.required],
          qualityPreItemsValueCtrl: ['', Validators.compose([Validators.maxLength(500)])],
          agreementTransferSINAMECCCtrl: ['', Validators.required],
          agreementTransferSINAMECCValueCtrl: ['', Validators.compose([Validators.maxLength(500)])],
          reportDataCtrlFile: [''],
          reportDataCtrlValue: [''],
        }),
      ]),
    });
  }

  private createUpdatedForm() {
    this.reportForm = this.formBuilder.group({
      formArray: this.formBuilder.array([
        this.formBuilder.group({
          whatInformationReportedCtrl: [this.reportEdit.report_information, Validators.required],
          isBaselineCtrl: [
            this.reportEdit.have_line_base,
            Validators.compose([Validators.maxLength(500), Validators.required]),
          ],
          isBaselineValueCtrlFile: [''],
          isBaselineValueCtrlValue: [this.reportEdit.base_line_report],
          qualityPreItemsCtrl: [this.reportEdit.have_quality_element, Validators.required],
          qualityPreItemsValueCtrl: [
            this.reportEdit.quality_element_description,
            Validators.compose([Validators.maxLength(500)]),
          ],
          agreementTransferSINAMECCCtrl: [this.reportEdit.transfer_data_with_sinamecc, Validators.required],
          agreementTransferSINAMECCValueCtrl: [
            this.reportEdit.transfer_data_with_sinamecc_description,
            Validators.compose([Validators.maxLength(500)]),
          ],
          reportDataCtrlFile: [''],
          reportDataCtrlValue: [this.reportEdit.individual_report_data],
        }),
      ]),
    });
  }
}
