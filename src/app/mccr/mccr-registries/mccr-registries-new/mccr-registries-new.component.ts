import { Component, OnInit } from '@angular/core';
import { Logger } from '@core';
import { environment } from '@env/environment';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { MitigationAction } from '@app/mitigation-actions/mitigation-action';
import { Router } from '@angular/router';
import { I18nService } from '@app/i18n';
import { MccrRegistriesService } from '@app/mccr/mccr-registries/mccr-registries.service';
import { MitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service';
import { TranslateService } from '@ngx-translate/core';
import { finalize, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

const log = new Logger('Report');

@Component({
  selector: 'app-mccr-registries-new',
  templateUrl: './mccr-registries-new.component.html',
  styleUrls: ['./mccr-registries-new.component.scss'],
})
export class MccrRegistriesNewComponent implements OnInit {
  version: string = environment.version;
  error: string;
  form: UntypedFormGroup;
  mitigationActions: Observable<MitigationAction[]>;
  processedMitigationActions: MitigationAction[] = [];
  isLoading = false;
  files: UntypedFormArray;

  constructor(
    private router: Router,
    private formBuilder: UntypedFormBuilder,
    private i18nService: I18nService,
    private service: MccrRegistriesService,
    private mitigationService: MitigationActionsService,
    private translateService: TranslateService,
    public snackBar: MatSnackBar,
  ) {
    this.createForm();
  }

  ngOnInit(): void {}

  submitForm() {
    this.isLoading = true;
    this.service
      .submitMccrRegistryNewForm(this.form.value)
      .pipe(
        finalize(() => {
          this.form.markAsPristine();
          this.isLoading = false;
        }),
      )
      .subscribe(
        (response) => {
          this.router.navigate(['/mccr/registries'], { replaceUrl: true });
          this.translateService.get('sucessfullySubmittedForm').subscribe((res: string) => {
            this.snackBar.open(res, null, { duration: 3000 });
          });
          log.debug(`${response.statusCode} status code received from form`);
        },
        (error) => {
          log.debug(`Mccr Registry File error: ${error}`);
          this.error = error;
        },
      );
  }

  private createForm() {
    this.form = this.formBuilder.group({
      mitigationActionCtrl: ['', Validators.required],
      files: this.formBuilder.array([this.createItem()]),
    });
    this.mitigationActions = this.initialFormData().pipe(
      tap((mitigationActions: MitigationAction[]) => {
        this.processedMitigationActions = mitigationActions;
      }),
    );
  }

  private createItem(): UntypedFormGroup {
    return this.formBuilder.group({
      file: [{ value: undefined, disabled: false }, []],
    });
  }

  public addFile(): void {
    const control = <UntypedFormArray>this.form.controls['files'];
    control.push(this.createItem());
  }

  public removeFile(i: number) {
    const control = <UntypedFormArray>this.form.controls['files'];
    control.removeAt(i);
  }

  private initialFormData(): Observable<MitigationAction[]> {
    return this.mitigationService.mitigationActions(this.i18nService.language.split('-')[0]).pipe(
      finalize(() => {
        this.isLoading = false;
      }),
    );
  }
}
