import { Component, OnInit } from '@angular/core';
import { Logger } from '@core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MccrPocService } from '@app/mccr/mccr-poc/mccr-poc.service';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { finalize } from 'rxjs/operators';

const log = new Logger('Report');

@Component({
  selector: 'app-mccr-poc-new-buyer-account',
  templateUrl: './mccr-poc-new-buyer-account.component.html',
  styleUrls: ['./mccr-poc-new-buyer-account.component.scss'],
})
export class MccrPocNewBuyerAccountComponent implements OnInit {
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
      .submitNewBuyerAccount(this.form.value)
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
