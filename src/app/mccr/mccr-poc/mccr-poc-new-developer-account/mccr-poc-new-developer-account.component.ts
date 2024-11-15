import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Logger } from '@core';
import { TranslateService } from '@ngx-translate/core';
import { MccrPocService } from '@app/mccr/mccr-poc/mccr-poc.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';

const log = new Logger('Report');

@Component({
  selector: 'app-mccr-poc-new-developer-account',
  templateUrl: './mccr-poc-new-developer-account.component.html',
  styleUrls: ['./mccr-poc-new-developer-account.component.scss'],
})
export class MccrPocNewDeveloperAccountComponent implements OnInit {
  isLoading = false;
  error: string;
  form: UntypedFormGroup;
  createDisable = false;
  account_number = '';

  constructor(
    private formBuilder: UntypedFormBuilder,
    private service: MccrPocService,
    private translateService: TranslateService,
    public snackBar: MatSnackBar
  ) {
    this.createForm();
  }

  ngOnInit(): void {}

  createForm() {
    this.form = this.formBuilder.group({
      user_id: ['', Validators.required],
    });
  }

  submitForm() {
    this.isLoading = true;
    this.service
      .submitNewDeveloperAccount(this.form.value)
      .pipe(
        finalize(() => {
          this.form.markAsPristine();
          this.isLoading = false;
        })
      )
      .subscribe(
        (response: any) => {
          this.translateService.get('sucessfullySubmittedForm').subscribe((res: string) => {
            this.snackBar.open(res, null, { duration: 3000 });
          });
          log.debug(`${response.statusCode} status code received from form`);
          this.createDisable = true;
          this.account_number = response.account_number;
        },
        (error) => {
          log.debug(`Error: ${error}`);
          this.error = error;
        }
      );
  }
}
