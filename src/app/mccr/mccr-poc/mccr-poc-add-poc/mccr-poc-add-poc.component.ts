import { Component, OnInit } from '@angular/core';
import { Logger } from '@core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MccrPocService } from '@app/mccr/mccr-poc/mccr-poc.service';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

const log = new Logger('Report');

@Component({
  selector: 'app-mccr-poc-add-poc',
  templateUrl: './mccr-poc-add-poc.component.html',
  styleUrls: ['./mccr-poc-add-poc.component.scss'],
})
export class MccrPocAddPocComponent implements OnInit {
  isLoading = false;
  error: string;
  form: UntypedFormGroup;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: UntypedFormBuilder,
    private service: MccrPocService,
    private router: Router,
    private translateService: TranslateService,
    public snackBar: MatSnackBar
  ) {
    this.createForm();
  }

  ngOnInit(): void {}

  submitForm() {
    this.isLoading = true;
    this.service
      .submitNewUcc(this.form.value)
      .pipe(
        finalize(() => {
          this.form.markAsPristine();
          this.isLoading = false;
        })
      )
      .subscribe(
        (response) => {
          this.router.navigate([`/mccr/poc/detail/${this.form.value.uccBatchCode}`], { replaceUrl: true });
          this.translateService.get('sucessfullySubmittedForm').subscribe((res: string) => {
            this.snackBar.open(res, null, { duration: 3000 });
          });
          log.debug(`${response.statusCode} status code received from form`);
        },
        (error) => {
          log.debug(`Mccr Registry File error: ${error}`);
          this.error = error;
        }
      );
  }

  back() {
    this.router.navigate([`/mccr/poc`], { replaceUrl: true });
  }

  createForm() {
    this.form = this.formBuilder.group({
      uccBatchCode: ['', Validators.required],
      uccBatchSize: ['', Validators.required],
      userId: ['', Validators.required],
    });
  }
}
