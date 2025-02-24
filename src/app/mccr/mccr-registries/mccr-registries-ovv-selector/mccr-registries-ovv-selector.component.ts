import { Component, OnInit } from '@angular/core';
import { Logger } from '@core';
import { Ovv } from '@app/mccr/mccr-registries/mccr-registries-ovv-selector/ovv';
import { MccrRegistry } from '@app/mccr/mccr-registries/mccr-registry';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MccrRegistriesService } from '@app/mccr/mccr-registries/mccr-registries.service';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

const log = new Logger('Report');

@Component({
  selector: 'app-mccr-registries-ovv-selector',
  templateUrl: './mccr-registries-ovv-selector.component.html',
  styleUrls: ['./mccr-registries-ovv-selector.component.scss'],
  standalone: false,
})
export class MccrRegistriesOvvSelectorComponent implements OnInit {
  ovvs: Ovv[];
  isLoading = false;
  mccrRegistry: MccrRegistry;
  error: string;
  form: UntypedFormGroup;

  constructor(
    private router: Router,
    private service: MccrRegistriesService,
    public snackBar: MatSnackBar,
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private translateService: TranslateService,
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.service.currentMccrRegistry.subscribe((message) => (this.mccrRegistry = message));
    this.service
      .getOvvs()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe((response: Ovv[]) => {
        this.ovvs = response;
      });
  }

  submitForm() {
    this.isLoading = true;
    this.service
      .submitOvvSelector(this.form.value, this.route.snapshot.paramMap.get('id'))
      .pipe(
        finalize(() => {
          this.form.markAsPristine();
          this.isLoading = false;
        }),
      )
      .subscribe(
        (response) => {
          // :id/versions
          this.router.navigate([`mccr/registries`], { replaceUrl: true });
          this.translateService.get('sucessfullySubmittedForm').subscribe((res: string) => {
            this.snackBar.open(res, null, { duration: 3000 });
          });
          log.debug(`${response.statusCode} status code received from form`);
        },
        (error) => {
          log.debug(`Report File error: ${error}`);
          this.error = error;
        },
      );
  }

  private createForm() {
    this.isLoading = true;
    this.form = this.formBuilder.group({
      ovvCtrl: ['', Validators.required],
    });
  }
}
