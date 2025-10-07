import { Component, OnInit } from '@angular/core';
import { Logger } from '@core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MccrPocService } from '@app/mccr/mccr-poc/mccr-poc.service';
import { finalize } from 'rxjs/operators';
import { SnackbarService } from '@app/@shared/snackbar-service/snackbar.service';

const log = new Logger('Report');

@Component({
  selector: 'app-mccr-poc-new-buyer-account',
  templateUrl: './mccr-poc-new-buyer-account.component.html',
  styleUrls: ['./mccr-poc-new-buyer-account.component.scss'],
  standalone: false,
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
    public snackBar: SnackbarService,
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
        }),
      )
      .subscribe(
        (response: any) => {
          this.snackBar.show('sucessfullySubmittedForm');
          this.createDisable = true;
          this.account_number = response.account_number;
        },
        (error) => {
          log.debug(`Error: ${error}`);
          this.error = error;
        },
      );
  }
}
