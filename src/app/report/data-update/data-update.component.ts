import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, AbstractControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Report } from '../interfaces/report';
import { ReportDataPayload } from '../interfaces/report-data-payload';
import { ReportService } from '../report.service';
import { SnackbarService } from '@app/@shared/snackbar-service/snackbar.service';
import { untilDestroyed } from '@app/@core';

@Component({
  selector: 'app-data-update',
  templateUrl: './data-update.component.html',
  styleUrls: ['./data-update.component.scss'],
  standalone: false,
})
export class DataUpdateComponent implements OnInit {
  reportForm: UntypedFormGroup;
  error: string;
  isLoading = false;
  report: ReportDataPayload;
  stateLabel = 'submitted';
  @Input() reportEdit: Report;

  constructor(
    private router: Router,
    private formBuilder: UntypedFormBuilder,
    private reportService: ReportService,
    public snackBar: SnackbarService,
  ) {
    this.reportService.currentReport.pipe(untilDestroyed(this)).subscribe((message) => {
      this.report = message;
    });
  }

  ngOnInit(): void {
    if (this.reportEdit) {
      this.createUpdatedForm();
    } else {
      this.createForm();
    }
  }

  ngOnDestroy() {}

  get formArray(): AbstractControl | null {
    return this.reportForm.get('formArray');
  }

  private createForm() {
    this.reportForm = this.formBuilder.group({
      formArray: this.formBuilder.array([
        this.formBuilder.group({
          authorNameCtrl: ['', Validators.compose([Validators.maxLength(350), Validators.required])], // miss this
          lastUpdateCtrl: ['', Validators.required],
          lastUpdateChangeCtrl: ['', Validators.compose([Validators.maxLength(500), Validators.required])], // miss this
          descriptionCtrl: ['', Validators.compose([Validators.maxLength(500), Validators.required])],
        }),
      ]),
    });
  }

  private createUpdatedForm() {
    this.reportForm = this.formBuilder.group({
      formArray: this.formBuilder.array([
        this.formBuilder.group({
          authorNameCtrl: [
            this.reportEdit.report_data_change_log[0].author.first_name,
            Validators.compose([Validators.maxLength(350), Validators.required]),
          ], // miss this
          lastUpdateCtrl: [this.reportEdit.report_data_change_log[0].updated, Validators.required],
          lastUpdateChangeCtrl: [
            this.reportEdit.report_data_change_log[0].changes,
            Validators.compose([Validators.maxLength(500), Validators.required]),
          ], // miss this
          descriptionCtrl: [
            this.reportEdit.report_data_change_log[0].change_description,
            Validators.compose([Validators.maxLength(500), Validators.required]),
          ],
        }),
      ]),
    });
  }

  private buildForm() {
    const payload: ReportDataPayload = {
      report_data_change_log: {
        changes: this.reportForm.value['formArray'][0].lastUpdateChangeCtrl,
        change_description: this.reportForm.value['formArray'][0].descriptionCtrl,
      },
    };

    return payload;
  }

  submitForm() {
    this.isLoading = true;
    const payload = this.buildForm();
    const reportData = Object.assign(this.report, payload);
    this.reportService.updateCurrentReport(reportData);

    this.reportService
      .submitEditReport(payload, this.reportEdit ? this.reportEdit.id.toString() : this.report.id.toString())
      .pipe(
        finalize(() => {
          this.reportForm.markAsPristine();
          this.isLoading = false;
        }),
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/report'], { replaceUrl: true });
          this.snackBar.show('specificLabel.saveInformation');
        },
        error: (error) => {
          this.error = error;
        },
      });
  }
}
