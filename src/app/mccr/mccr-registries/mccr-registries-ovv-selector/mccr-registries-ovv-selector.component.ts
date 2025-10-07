import { Component, OnInit } from '@angular/core';
import { Logger, untilDestroyed } from '@core';
import { Ovv } from '@app/mccr/mccr-registries/mccr-registries-ovv-selector/ovv';
import { MccrRegistry } from '@app/mccr/mccr-registries/mccr-registry';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MccrRegistriesService } from '@app/mccr/mccr-registries/mccr-registries.service';
import { finalize } from 'rxjs/operators';
import { SnackbarService } from '@app/@shared/snackbar-service/snackbar.service';

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
    public snackBar: SnackbarService,
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.service.currentMccrRegistry.pipe(untilDestroyed(this)).subscribe((message) => (this.mccrRegistry = message));
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

  ngOnDestroy() {}

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
      .subscribe({
        next: (response) => {
          // :id/versions
          this.router.navigate([`mccr/registries`], { replaceUrl: true });
          this.snackBar.show('sucessfullySubmittedForm');
          log.debug(`${response.statusCode} status code received from form`);
        },
        error: (error) => {
          log.debug(`Report File error: ${error}`);
          this.error = error;
        },
      });
  }

  private createForm() {
    this.isLoading = true;
    this.form = this.formBuilder.group({
      ovvCtrl: ['', Validators.required],
    });
  }
}
