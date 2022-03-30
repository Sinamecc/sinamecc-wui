import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl } from '@angular/forms';

import { Logger } from '@core';
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

  get formArray(): AbstractControl | null {
    return this.mainGroup.get('formArray');
  }

  createForm() {
    this.mainGroup = this.formBuilder.group({
      // this.formBuilder.array([])
      formArray: this.formBuilder.array([this.reportFormDataFrm, this.methodologicalSheetFrm, this.dataUpdateFrm]),
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
