import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { I18nService } from '@app/i18n';
import { TranslateService } from '@ngx-translate/core';
import { ReportDataCatalog } from '../interfaces/report-data';
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

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private i18nService: I18nService,
    private reportService: ReportService,
    private translateService: TranslateService,
    public snackBar: MatSnackBar
  ) {}

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
    //const payload = this.buildForm();
    this.translateService.get('sucessfullySubmittedForm').subscribe((res: string) => {
      this.snackBar.open(res, null, { duration: 3000 });
      this.mainStepper.next();
    });
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
          measurementFrequencyOtherCtrl: [''],
          timeSeriesAvailableStartCtrl: ['', Validators.required],
          timeSeriesAvailableEndCtrl: ['', Validators.required],
          geographicCoverageCtrl: ['', Validators.required],
          geographicCoverageOtherCtrl: [''],
          disaggregationCtrl: ['', Validators.compose([Validators.maxLength(500), Validators.required])],
          limitationsCtrl: ['', Validators.compose([Validators.maxLength(500), Validators.required])],
          sustainableCtrl: ['', Validators.compose([Validators.maxLength(500), Validators.required])],
          commentsCtrl: ['', Validators.compose([Validators.maxLength(500), Validators.required])],
        }),
        this.formBuilder.group({
          institutionCtrl: [
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
          logsCtrl: ['', Validators.compose([Validators.required, Validators.maxLength(500), Validators.required])],
        }),

        this.formBuilder.group({
          dataTypeCtrl: ['', Validators.required],
          sinameccClassifiersCtrl: ['', Validators.required],
        }),
      ]),
    });
  }
}
