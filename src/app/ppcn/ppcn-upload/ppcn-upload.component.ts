import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { environment } from '@env/environment';
import { Router } from '@angular/router';
import { I18nService, Logger } from '@app/core';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material';
import { Ppcn } from '@app/ppcn/ppcn_registry';
import { Observable } from 'rxjs';
import { PpcnService } from '@app/ppcn/ppcn.service';
import { tap, finalize } from 'rxjs/operators';
const log = new Logger('Report');

@Component({
  selector: 'app-ppcn-upload',
  templateUrl: './ppcn-upload.component.html',
  styleUrls: ['./ppcn-upload.component.scss']
})
export class PpcnUploadComponent implements OnInit {

  version: string = environment.version;
  error: string;
  form: FormGroup;
  isLoading = false;
  files: FormArray;
  ppcns: Observable<Ppcn[]>;
  processedPpcns: Ppcn[] = [];

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private i18nService: I18nService,
    private translateService: TranslateService,
    private ppcnService: PpcnService,
    public snackBar: MatSnackBar) {
      this.createForm();
    }

  ngOnInit() {
  }

  submitForm() {
    this.isLoading = true;
    this.ppcnService.submitPpcnNewFile(this.form.value)
      .pipe(finalize(() => {
        this.form.markAsPristine();
        this.isLoading = false;
      }))
      .subscribe(response => {
        this.router.navigate(['/ppcn/registries'], { replaceUrl: true });
        this.translateService.get('Sucessfully submitted file').subscribe((res: string) => { this.snackBar.open(res, null, {duration: 3000 }); });
        log.debug(`${response.statusCode} status code received from form`);

      }, error => {
        log.debug(`PPCN File error: ${error}`);
        this.error = error;
      });

  }

  private createForm() {
    this.form = this.formBuilder.group({
      ppcnCtrl: ['', Validators.required],
      files: this.formBuilder.array([
        this.createItem(), this.createItem(), this.createItem()
      ])

    });
    this.ppcns = this.initialFormData().pipe(
      tap((ppcns: Ppcn[]) => { this.processedPpcns = ppcns; })
    );
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

  private initialFormData(): Observable<Ppcn[]> {
    return this.ppcnService.ppcn(this.i18nService.language.split('-')[0])
    .pipe(finalize(() => { this.isLoading = false; }));
  }

}
