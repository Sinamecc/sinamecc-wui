import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { finalize } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { Ovv } from '@app/mccr-registries/mccr-registries-ovv-selector/ovv';
import { MccrRegistry } from '@app/mccr-registries/mccr-registry';
import { MccrRegistriesService } from '@app/mccr-registries/mccr-registries.service';
import { MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { Logger, I18nService, AuthenticationService } from '@app/core'; 

const log = new Logger('Report');

@Component({
  selector: 'app-mccr-registries-ovv-selector',
  templateUrl: './mccr-registries-ovv-selector.component.html',
  styleUrls: ['./mccr-registries-ovv-selector.component.scss']
})
export class MccrRegistriesOvvSelectorComponent implements OnInit {


  ovvs: Ovv[];
  isLoading = false;
  mccrRegistry: MccrRegistry;
  error: string;
  form: FormGroup;

  constructor(private router: Router,
    private service: MccrRegistriesService,
    public snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private translateService: TranslateService) {
      this.createForm();
   }

  ngOnInit() {
    this.isLoading = true;
    this.service.currentMccrRegistry.subscribe(message => this.mccrRegistry = message);
    this.service.getOvvs()
     .pipe(finalize(() => { this.isLoading = false; }))
     .subscribe((response: Ovv[]) => { this.ovvs = response; });
  }



  submitForm() {
    this.isLoading = true;
    this.service.submitOvvSelector(this.form.value, this.route.snapshot.paramMap.get('id'))
      .pipe(finalize(() => {
        this.form.markAsPristine();
        this.isLoading = false;
      }))
      .subscribe(response => {
        // :id/versions
        this.router.navigate([`mccr/registries`], { replaceUrl: true });
        this.translateService.get('Sucessfully submitted form').subscribe((res: string) => { this.snackBar.open(res, null, {duration: 3000 }); });
        log.debug(`${response.statusCode} status code received from form`);

      }, error => {
        log.debug(`Report File error: ${error}`);
        this.error = error;
      });
  }

  private createForm() {
    this.isLoading = true;
    this.form = this.formBuilder.group({
      ovvCtrl: ['', Validators.required]
    });

  }
}
