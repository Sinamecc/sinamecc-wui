import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { I18nService } from '@app/i18n';
import { TranslateService } from '@ngx-translate/core';
import { Report } from '../interfaces/report';
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
  @Input() reportEdit: Report;
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
    if (this.reportEdit) {
      this.createUpdatedForm();
    } else {
      this.createForm();
    }

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
      sustainable: this.reportForm.value['formArray'][0].sustainableCtrl,
      information_source: this.reportForm.value['formArray'][1].sourceTypeCtrl,
      statistical_operation: this.reportForm.value['formArray'][1].operationNameCtrl,
      responsible_institution: this.reportForm.value['formArray'][1].institutionCtrl,
      contact: {
        full_name: this.reportForm.value['formArray'][2].nameCtrl,
        job_title: this.reportForm.value['formArray'][2].positionCtrl,
        institution: this.reportForm.value['formArray'][2].departmentCtrl,
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
            '',
            Validators.compose([Validators.required, Validators.maxLength(350), Validators.required]),
          ],
          sourceTypeCtrl: ['', Validators.required],
          sourceTypeOtherCtrl: [''],
          operationNameCtrl: [
            '',
            Validators.compose([Validators.required, Validators.maxLength(500), Validators.required]),
          ],
        }),
        this.formBuilder.group({
          nameCtrl: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
          positionCtrl: ['', Validators.compose([Validators.required, Validators.maxLength(350)])],
          departmentCtrl: ['', Validators.compose([Validators.maxLength(100), Validators.required])],
          emailCtrl: ['', Validators.compose([Validators.required, Validators.email, Validators.maxLength(40)])],
          phoneCtrl: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
          logsCtrl: ['', Validators.compose([Validators.required, Validators.maxLength(500)])], // miss this
        }),
        this.formBuilder.group({
          dataTypeCtrl: ['', Validators.required],
          sinameccClassifiersCtrl: ['', Validators.required],
        }),
      ]),
    });
  }

  private createUpdatedForm() {
    this.reportForm = this.formBuilder.group({
      formArray: this.formBuilder.array([
        this.formBuilder.group({
          nameCtrl: [this.reportEdit.name, Validators.compose([Validators.maxLength(200), Validators.required])],
          descriptionCtrl: [
            this.reportEdit.description,
            Validators.compose([Validators.maxLength(800), Validators.required]),
          ],
          unitCtrl: [this.reportEdit.unit, Validators.compose([Validators.maxLength(300), Validators.required])],
          calculationMethodologyCtrl: [
            this.reportEdit.calculation_methodology,
            Validators.compose([Validators.maxLength(800), Validators.required]),
          ],
          measurementFrequencyCtrl: [this.reportEdit.measurement_frequency, Validators.required],
          measurementFrequencyOtherCtrl: [this.reportEdit.measurement_frequency_other], // miss this
          timeSeriesAvailableStartCtrl: [this.reportEdit.from_date, Validators.required],
          timeSeriesAvailableEndCtrl: [this.reportEdit.to_date, Validators.required],
          geographicCoverageCtrl: [this.reportEdit.geographic_coverage, Validators.required],
          geographicCoverageOtherCtrl: [''],
          disaggregationCtrl: [
            this.reportEdit.disaggregation,
            Validators.compose([Validators.maxLength(500), Validators.required]),
          ],
          limitationsCtrl: [
            this.reportEdit.limitation,
            Validators.compose([Validators.maxLength(500), Validators.required]),
          ],
          sustainableCtrl: [
            this.reportEdit.sustainable,
            Validators.compose([Validators.maxLength(500), Validators.required]),
          ], // miss this
          commentsCtrl: [
            this.reportEdit.additional_information,
            Validators.compose([Validators.maxLength(500), Validators.required]),
          ],
        }),
        this.formBuilder.group({
          institutionCtrl: [
            this.reportEdit.responsible_institution,
            Validators.compose([Validators.required, Validators.maxLength(350), Validators.required]),
          ],
          sourceTypeCtrl: [this.reportEdit.information_source.map((x) => x.id), Validators.required],
          sourceTypeOtherCtrl: [''],
          operationNameCtrl: [
            this.reportEdit.statistical_operation,
            Validators.compose([Validators.required, Validators.maxLength(500), Validators.required]),
          ],
        }),
        this.formBuilder.group({
          nameCtrl: [
            this.reportEdit.contact.full_name,
            Validators.compose([Validators.required, Validators.maxLength(100)]),
          ],
          positionCtrl: [
            this.reportEdit.contact.job_title,
            Validators.compose([Validators.required, Validators.maxLength(350)]),
          ],
          departmentCtrl: [
            this.reportEdit.contact.institution,
            Validators.compose([Validators.maxLength(100), Validators.required]),
          ],
          emailCtrl: [
            this.reportEdit.contact.email,
            Validators.compose([Validators.required, Validators.email, Validators.maxLength(40)]),
          ],
          phoneCtrl: [
            this.reportEdit.contact.phone,
            Validators.compose([Validators.required, Validators.minLength(8)]),
          ],
          logsCtrl: [
            this.reportEdit.contact_annotation,
            Validators.compose([Validators.required, Validators.maxLength(500)]),
          ], // miss this
        }),
        this.formBuilder.group({
          dataTypeCtrl: [this.reportEdit.data_type.id, Validators.required],
          sinameccClassifiersCtrl: [this.reportEdit.classifier.map((x: { id: any }) => x.id), Validators.required],
        }),
      ]),
    });
  }
}
