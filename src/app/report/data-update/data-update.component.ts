import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { I18nService } from '@app/i18n';
import { TranslateService } from '@ngx-translate/core';
import { ReportService } from '../report.service';

@Component({
  selector: 'app-data-update',
  templateUrl: './data-update.component.html',
  styleUrls: ['./data-update.component.scss'],
})
export class DataUpdateComponent implements OnInit {
  reportForm: FormGroup;
  error: string;
  isLoading = false;

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
  }

  get formArray(): AbstractControl | null {
    return this.reportForm.get('formArray');
  }

  private createForm() {
    this.reportForm = this.formBuilder.group({
      formArray: this.formBuilder.array([
        this.formBuilder.group({
          authorNameCtrl: ['', Validators.compose([Validators.maxLength(350), Validators.required])],
          lastUpdateCtrl: ['', Validators.required],
          lastUpdateChangeCtrl: ['', Validators.compose([Validators.maxLength(500), Validators.required])],
          descriptionCtrl: ['', Validators.compose([Validators.maxLength(500), Validators.required])],
        }),
      ]),
    });
  }
}
