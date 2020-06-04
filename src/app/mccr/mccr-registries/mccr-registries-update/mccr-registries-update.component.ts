import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { finalize, tap } from 'rxjs/operators';

import { environment } from '@env/environment';
import { Logger, I18nService, AuthenticationService } from '@app/core';

const log = new Logger('Report');

import { MccrRegistriesService } from '@app/mccr/mccr-registries/mccr-registries.service';
import { MitigationAction } from '@app/mitigation-actions/mitigation-action';
import { Observable } from 'rxjs/Observable';
import { MitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { MccrRegistry } from '@app/mccr/mccr-registries/mccr-registry';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-mccr-registries-update',
  templateUrl: './mccr-registries-update.component.html',
  styleUrls: ['./mccr-registries-update.component.scss']
})
export class MccrRegistriesUpdateComponent implements OnInit {

  version: string = environment.version;
  error: string;
  form: FormGroup;
  mitigationActions: Observable<MitigationAction[]>;
  processedMitigationActions: MitigationAction[] = [];
  mccrRegistry: Observable<MccrRegistry>;
  isLoading = false;
  files: FormArray;
  id: string;
  formValues: any;

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private i18nService: I18nService,
    private service: MccrRegistriesService,
    private mitigationService: MitigationActionsService,
    private route: ActivatedRoute,
    private translateService: TranslateService,
    public snackBar: MatSnackBar) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.createForm();

  }

  ngOnInit() { }

  submitForm() {

    this.isLoading = true;
    this.service.submitMitigationActionUpdateForm(this.form.value, this.id)
      .pipe(finalize(() => {
        this.form.markAsPristine();
        this.isLoading = false;
      }))
      .subscribe(response => {
        this.router.navigate(['/mccr/registries'], { replaceUrl: true });
        this.translateService.get('Sucessfully submitted form')
          .subscribe((res: string) => { this.snackBar.open(res, null, { duration: 3000 }); });
        log.debug(`${response.statusCode} status code received from form`);

      }, error => {
        log.debug(`Mccr Registry File error: ${error}`);
        this.error = error;
      });
  }

  private createForm() {
    this.form = this.formBuilder.group({
      mitigation: ['', Validators.required],
      status: ['', Validators.required]

    });

    this.formValues = forkJoin(
      this.initialFormData(),
      this.initialMitigationActions(),
      (formOptions, formData) => {
        this.isLoading = false;
        return { formOptions, formData };
      }
    );
  }

  private initialMitigationActions(): Observable<MitigationAction[]> {
    const mitigationActions = this.mitigationService.mitigationActions(this.i18nService.language.split('-')[0]).pipe(
      tap(actions => {
        this.processedMitigationActions = actions;
      }));
    return mitigationActions;
  }

  private loadFormData(): Observable<MccrRegistry> {
    return this.service.getMccrRegistry(this.id)
      .pipe(finalize(() => { this.isLoading = false; }));
  }

  private initialFormData(): Observable<MccrRegistry> {
    const mccrRegistry = this.loadFormData().pipe(
      tap(incomingMccrRegistry => {
        this.form.setValue({
          mitigation: incomingMccrRegistry['mitigation'],
          status: incomingMccrRegistry['fsm_state']
        });

      })

    );
    return mccrRegistry;

  }

  compareIds(id1: any, id2: any): boolean {
    const a1 = determineId(id1);
    const a2 = determineId(id2);
    return a1 === a2;
  }


}

export function determineId(id: any): string {
  if (id.constructor.name === 'array' && id.length > 0) {
    return '' + id[0];
  }
  return '' + id;
}
