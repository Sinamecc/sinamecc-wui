import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { finalize, tap } from 'rxjs/operators';

import { environment } from '@env/environment';
import { Logger, I18nService, AuthenticationService } from '@app/core';

const log = new Logger('Report');


import { MccrRegistriesService } from './../mccr-registries.service';
import { MitigationAction } from '@app/mitigation-actions/mitigation-action';
import { Observable } from 'rxjs/Observable';
import { MitigationActionsService } from '@app/mitigation-actions/mitigation-actions.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-mccr-registries-new',
  templateUrl: './mccr-registries-new.component.html',
  styleUrls: ['./mccr-registries-new.component.scss']
})
export class MccrRegistriesNewComponent implements OnInit {

  version: string = environment.version;
  error: string;
  form: FormGroup;
  mitigationActions: Observable<MitigationAction[]>;
  processedMitigationActions: MitigationAction[] = [];
  isLoading = false;
  files: FormArray;

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private i18nService: I18nService,
    private service: MccrRegistriesService,
    private mitigationService: MitigationActionsService) {
    this.createForm();
  }

  ngOnInit() {}

  submitForm() {

    this.isLoading = true;
    this.service.submitMccrRegistryNewForm(this.form.value)
      .pipe(finalize(() => {
        this.form.markAsPristine();
        this.isLoading = false;
      }))
      .subscribe(response => {
        this.router.navigate(['/mccr/registries'], { replaceUrl: true });
        log.debug(`${response.statusCode} status code received from form`);

      }, error => {
        log.debug(`Mccr Registry File error: ${error}`);
        this.error = error;
      });
  }

  private createForm() {
    this.form = this.formBuilder.group({
      mitigationActionCtrl: ['', Validators.required],
      files: this.formBuilder.array([ this.createItem() ])
      // fileCtrl: [{ value: undefined, disabled: false }, []],
      //units: this._fb.array([
      //  this.getUnit()
      //])
    });
    this.mitigationActions = this.initialFormData().pipe(
      tap((mitigationActions: MitigationAction[]) => { this.processedMitigationActions = mitigationActions; })
    );
    //this.initialFormData();
  }

  private createItem(): FormGroup {
    return this.formBuilder.group({
      file: [{ value: undefined, disabled: false }, []]
    });
  }

  private addFile(): void {
    const control = <FormArray>this.form.controls['files'];
    control.push(this.createItem());
  }

  private removeFile(i: number) {
    const control = <FormArray>this.form.controls['files'];
    control.removeAt(i);
  }
  
  private initialFormData(): Observable<MitigationAction[]> {
    return this.mitigationService.mitigationActions()
    .pipe(finalize(() => { this.isLoading = false; }));
  }

}