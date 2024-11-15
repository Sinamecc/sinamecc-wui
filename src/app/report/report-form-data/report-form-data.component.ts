import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UntypedFormGroup, UntypedFormBuilder, Validators, AbstractControl } from '@angular/forms';

import { Logger } from '@core';
import { I18nService } from '@app/i18n';
import { environment } from '@env/environment';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ReportService } from '@app/report/report.service';
import { ReportDataCatalog } from '../interfaces/report-data';
import { ReportDataPayload } from '../interfaces/report-data-payload';
import { Report } from '../interfaces/report';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-report-form-data',
  templateUrl: './report-form-data.component.html',
  styleUrls: ['./report-form-data.component.scss'],
})
export class ReportFormDataComponent implements OnInit {
  transferMethodToInstitutions = 'example: email, web page, REST API Call, SFTP, FTP, WeTransfer, other.';
  version: string = environment.version;
  error: string;
  reportForm: UntypedFormGroup;
  isLoading = false;
  methodological = false;
  catalogs: ReportDataCatalog = undefined;
  reportDataFile: File;
  baseLineReportFile: File;
  @Input() mainStepper: any;
  @Input() reportEdit: Report;

  loadingFiles = false;
  files = {};

  constructor(
    private router: Router,
    private formBuilder: UntypedFormBuilder,
    private i18nService: I18nService,
    private reportService: ReportService,
    private translateService: TranslateService,
    public snackBar: MatSnackBar
  ) {
    this.createForm();
    this.getCatalogs();
  }

  ngOnInit(): void {
    if (this.reportEdit) {
      this.createUpdatedForm();
    }
  }

  private buildForm() {
    const payload: ReportDataPayload = {
      other_classifier: '',
      report_information: this.reportForm.value['formArray'][0].whatInformationReportedCtrl,
      have_base_line: this.reportForm.value['formArray'][0].isBaselineCtrl,
      have_quality_element: this.reportForm.value['formArray'][0].qualityPreItemsCtrl,
      quality_element_description: this.reportForm.value['formArray'][0].qualityPreItemsValueCtrl,
      transfer_data_with_sinamecc: this.reportForm.value['formArray'][0].agreementTransferSINAMECCCtrl,
      transfer_data_with_sinamecc_description: this.reportForm.value['formArray'][0].agreementTransferSINAMECCValueCtrl,
      base_line_report: this.reportForm.value['formArray'][0].isBaselineValueCtrlFile,
      individual_report_data: this.reportForm.value['formArray'][0].reportDataCtrlValue,
    };

    return payload;
  }

  private createForm() {
    this.reportForm = this.formBuilder.group({
      formArray: this.formBuilder.array([
        this.formBuilder.group({
          whatInformationReportedCtrl: ['', Validators.required],
          isBaselineCtrl: [false, Validators.compose([Validators.maxLength(500), Validators.required])],
          isBaselineValueCtrlFile: ['', Validators.compose([Validators.maxLength(500)])],
          isBaselineValueCtrlValue: [''],
          reportUpdateCtrl: [''],
          howReportedDataCtrl: [''],
          qualityPreItemsCtrl: ['', Validators.required],
          qualityPreItemsValueCtrl: ['', Validators.compose([Validators.maxLength(500)])],
          agreementTransferSINAMECCCtrl: ['', Validators.required],
          agreementTransferSINAMECCValueCtrl: ['', Validators.compose([Validators.maxLength(500)])],
          reportDataCtrlValue: [''],
          file: [''],
        }),
      ]),
    });
  }

  async loadFile() {
    this.loadingFiles = true;
    for (const file of this.reportEdit.files) {
      const s3File = await this.reportService.downloadResource(file.file.replace('/api', ''), file.filename);
      this.files[file.report_type] = s3File;
    }
    this.loadingFiles = false;
  }

  private async createUpdatedForm() {
    this.isLoading = true;
    await this.loadFile();
    this.reportForm = this.formBuilder.group({
      formArray: this.formBuilder.array([
        this.formBuilder.group({
          whatInformationReportedCtrl: [this.reportEdit.report_information, Validators.required],
          isBaselineCtrl: [
            this.reportEdit.have_base_line,
            Validators.compose([Validators.maxLength(500), Validators.required]),
          ],
          isBaselineValueCtrlFile: [this.reportEdit.base_line_report, Validators.compose([Validators.maxLength(500)])],
          isBaselineValueCtrlValue: [this.reportEdit.base_line_report],
          reportUpdateCtrl: [this.files['base_line_report'] ? 1 : 2],
          howReportedDataCtrl: [this.files['report_file'] ? 1 : 2],
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
          reportDataCtrlValue: [this.reportEdit.individual_report_data],
        }),
      ]),
    });

    this.isLoading = false;
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

      const validReportData = this.reportForm.value['formArray'][0].reportDataCtrlValue !== '' ? true : false;

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

  uploadFile(event: Event, reportFile = true) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      if (reportFile) {
        this.reportDataFile = fileList[0];
      } else {
        this.baseLineReportFile = fileList[0];
      }
    }
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

    if (this.reportEdit) {
      this.sendUpdatedForm(payload);
    } else {
      this.sendNewForm(payload);
    }
  }

  sendNewForm(payload: ReportDataPayload) {
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
          const newPayload = Object.assign(payload, { id: response.id });
          this.reportService.updateCurrentReport(newPayload);
          this.reportService.updateCurrentReport(payload);
          this.successSendForm(response.id);
        },
        (error) => {
          this.error = error;
        }
      );
  }

  sendUpdatedForm(payload: ReportDataPayload) {
    this.reportService
      .submitEditReport(payload, this.reportEdit.id.toString())
      .pipe(
        finalize(() => {
          this.reportForm.markAsPristine();
          this.isLoading = false;
        })
      )
      .subscribe(
        (response) => {
          const newPayload = Object.assign(payload, { id: response.id });
          this.reportService.updateCurrentReport(newPayload);
          this.successSendForm(response.id);
        },
        (error) => {
          this.error = error;
        }
      );
  }

  successSendForm(id: string) {
    if (this.reportDataFile) {
      this.submitFile(id, 'report_file', this.reportDataFile);
    }

    if (this.baseLineReportFile) {
      this.submitFile(id, 'base_line_report', this.baseLineReportFile);
    }

    this.translateService.get('specificLabel.saveInformation').subscribe((res: string) => {
      this.snackBar.open(res, null, { duration: 3000 });
      this.mainStepper.next();
    });
  }

  async submitFile(id: string, key: string, file: File) {
    await this.reportService.submitReportFile(key, file, id).toPromise();
  }
}
