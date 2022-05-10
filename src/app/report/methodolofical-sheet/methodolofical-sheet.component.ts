import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { I18nService } from '@app/i18n';
import { TranslateService } from '@ngx-translate/core';
import { ReportDataCatalog } from '../interfaces/report-data';
import { ReportDataPayload } from '../interfaces/report-data-payload';
import { ReportService } from '../report.service';

@Component({
  selector: 'app-methodolofical-sheet',
  templateUrl: './methodolofical-sheet.component.html',
  styleUrls: ['./methodolofical-sheet.component.scss'],
})
export class MethodoloficalSheetComponent implements OnInit {
  reportForm: FormGroup;
  catalogs: ReportDataCatalog = undefined;
  error: string;
  isLoading = false;
  @Input() mainStepper: any;
  report: ReportDataPayload;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private i18nService: I18nService,
    private reportService: ReportService,
    private translateService: TranslateService,
    public snackBar: MatSnackBar,
    private datePipe: DatePipe
  ) {
    this.reportService.currentReport.subscribe((message) => {
      this.report = message;
    });
  }

  ngOnInit(): void {
    this.createForm();
    this.getCatalogs();
  }

  async getCatalogs() {
    this.catalogs = await this.reportService.getReportCatalogs().toPromise();
  }

  get formArray(): AbstractControl | null {
    return this.reportForm.get('formArray');
  }

  submitForm() {
    this.isLoading = true;
    const payload = this.buildForm();
    this.reportService.updateCurrentReport(Object.assign(this.report, payload));
    this.translateService.get('sucessfullySubmittedForm').subscribe((res: string) => {
      this.snackBar.open(res, null, { duration: 3000 });
      this.mainStepper.next();
    });
  }

  private buildForm() {
    const payload: ReportDataPayload = {
      name: this.reportForm.value['formArray'][0].nameCtrl,
      description: this.reportForm.value['formArray'][0].descriptionCtrl,
      unit: this.reportForm.value['formArray'][0].unitCtrl,
      calculation_methodology: this.reportForm.value['formArray'][0].calculationMethodologyCtrl,
      measurement_frequency: this.reportForm.value['formArray'][0].measurementFrequencyCtrl,
      from_date: this.datePipe.transform(
        this.reportForm.value['formArray'][0].timeSeriesAvailableStartCtrl,
        'yyyy-MM-dd'
      ),
      to_date: this.datePipe.transform(this.reportForm.value['formArray'][0].timeSeriesAvailableEndCtrl, 'yyyy-MM-dd'),
      geographic_coverage: this.reportForm.value['formArray'][0].geographicCoverageCtrl,
      disaggregation: this.reportForm.value['formArray'][0].disaggregationCtrl,
      limitation: this.reportForm.value['formArray'][0].limitationsCtrl,
      additional_information: this.reportForm.value['formArray'][0].commentsCtrl,
      information_source: this.reportForm.value['formArray'][1].sourceTypeCtrl,
      statistical_operation: this.reportForm.value['formArray'][1].operationNameCtrl,
      contact: {
        full_name: this.reportForm.value['formArray'][2].nameCtrl,
        job_title: this.reportForm.value['formArray'][2].positionCtrl,
        email: this.reportForm.value['formArray'][2].emailCtrl,
        phone: this.reportForm.value['formArray'][2].phoneCtrl,
      },
      contact_annotation: this.reportForm.value['formArray'][2].logsCtrl,
      data_type: this.reportForm.value['formArray'][3].dataTypeCtrl,
      classifier: this.reportForm.value['formArray'][3].sinameccClassifiersCtrl,
    };

    return payload;
  }

  private createForm() {
    this.reportForm = this.formBuilder.group({
      formArray: this.formBuilder.array([
        this.formBuilder.group({
          nameCtrl: ['', Validators.compose([Validators.maxLength(200), Validators.required])],
          descriptionCtrl: ['', Validators.compose([Validators.maxLength(800), Validators.required])],
          unitCtrl: ['', Validators.compose([Validators.maxLength(300), Validators.required])],
          calculationMethodologyCtrl: ['', Validators.compose([Validators.maxLength(800), Validators.required])],
          measurementFrequencyCtrl: ['', Validators.required],
          measurementFrequencyOtherCtrl: [''], // miss this
          timeSeriesAvailableStartCtrl: ['', Validators.required],
          timeSeriesAvailableEndCtrl: ['', Validators.required],
          geographicCoverageCtrl: ['', Validators.required],
          geographicCoverageOtherCtrl: [''], // miss this
          disaggregationCtrl: ['', Validators.compose([Validators.maxLength(500), Validators.required])],
          limitationsCtrl: ['', Validators.compose([Validators.maxLength(500), Validators.required])],
          sustainableCtrl: ['', Validators.compose([Validators.maxLength(500), Validators.required])], // miss this
          commentsCtrl: ['', Validators.compose([Validators.maxLength(500), Validators.required])],
        }),
        this.formBuilder.group({
          institutionCtrl: [
            // miss this
            '',
            Validators.compose([Validators.required, Validators.maxLength(350), Validators.required]),
          ],
          sourceTypeCtrl: ['', Validators.required],
          operationNameCtrl: [
            '',
            Validators.compose([Validators.required, Validators.maxLength(500), Validators.required]),
          ],
        }),
        this.formBuilder.group({
          nameCtrl: ['', Validators.compose([Validators.required, Validators.maxLength(40), Validators.required])],
          positionCtrl: ['', Validators.compose([Validators.required, Validators.maxLength(40), Validators.required])],
          emailCtrl: [
            '',
            Validators.compose([Validators.required, Validators.email, Validators.maxLength(40), Validators.required]),
          ],
          phoneCtrl: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.required])],
          logsCtrl: ['', Validators.compose([Validators.required, Validators.maxLength(500), Validators.required])], // miss this
        }),
        this.formBuilder.group({
          dataTypeCtrl: ['', Validators.required],
          sinameccClassifiersCtrl: ['', Validators.required],
        }),
      ]),
    });
  }
}
