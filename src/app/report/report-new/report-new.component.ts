import { ChangeDetectorRef, Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, AbstractControl } from '@angular/forms';

import { Logger } from '@core';
import { ReportFormDataComponent } from '../report-form-data/report-form-data.component';
import { MethodoloficalSheetComponent } from '../methodolofical-sheet/methodolofical-sheet.component';
import { DataUpdateComponent } from '../data-update/data-update.component';
import { ActivatedRoute } from '@angular/router';
import { Report } from '../interfaces/report';
import { ReportService } from '../report.service';

const log = new Logger('Report');

@Component({
  selector: 'app-report-new',
  templateUrl: './report-new.component.html',
  styleUrls: ['./report-new.component.scss'],
  standalone: false,
})
export class ReportNewComponent implements OnInit, AfterViewInit {
  isLoading = false;
  mainGroup: UntypedFormGroup;
  reportEdit: Report;

  @ViewChild(ReportFormDataComponent) reportFormData: ReportFormDataComponent;
  @ViewChild(MethodoloficalSheetComponent) methodologicalSheet: MethodoloficalSheetComponent;
  @ViewChild(DataUpdateComponent) dataUpdate: DataUpdateComponent;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private cdRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private service: ReportService,
  ) {
    this.createForm();
  }

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.reportEdit = await this.loadReport(id).finally(() => (this.isLoading = false));
    }
  }

  get formArray(): AbstractControl | null {
    return this.mainGroup.get('formArray');
  }

  createForm() {
    this.mainGroup = this.formBuilder.group({
      formArray: this.formBuilder.array([this.reportFormDataFrm, this.methodologicalSheetFrm, this.dataUpdateFrm]),
    });
  }

  private async loadReport(id: string) {
    this.isLoading = true;
    return await this.service.report(id).toPromise();
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
