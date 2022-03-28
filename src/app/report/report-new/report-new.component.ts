import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
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
import { ReportFormDataComponent } from '../report-form-data/report-form-data.component';
import { MethodoloficalSheetComponent } from '../methodolofical-sheet/methodolofical-sheet.component';
import { DataUpdateComponent } from '../data-update/data-update.component';

const log = new Logger('Report');

@Component({
  selector: 'app-report-new',
  templateUrl: './report-new.component.html',
  styleUrls: ['./report-new.component.scss'],
})
export class ReportNewComponent implements OnInit {
  isLoading = false;
  mainGroup: FormGroup;

  @ViewChild(ReportFormDataComponent) reportFormData: ReportFormDataComponent;
  @ViewChild(MethodoloficalSheetComponent) methodologicalSheet: MethodoloficalSheetComponent;
  @ViewChild(DataUpdateComponent) dataUpdate: DataUpdateComponent;

  constructor(private formBuilder: FormBuilder, private cdRef: ChangeDetectorRef) {
    this.createForm();
  }

  ngOnInit(): void {}

  createForm() {
    this.mainGroup = this.formBuilder.group({
      // this.formBuilder.array([])
      formArray: this.formBuilder.array([this.reportFormData, this.methodologicalSheet, this.dataUpdate]),
    });
  }

  get reportFormDataFrm() {
    return this.reportFormData ? this.reportFormData.reportForm : null;
  }

  get methodologicalSheetFrm() {
    return this.methodologicalSheet ? this.methodologicalSheet.reportForm : null;
  }

  get dataUpdateFrm() {
    return this.dataUpdate ? this.dataUpdate.reportForm : null;
  }

  ngAfterViewInit() {
    this.cdRef.detectChanges();
    setTimeout(() => this.createForm(), 0);
  }
}
