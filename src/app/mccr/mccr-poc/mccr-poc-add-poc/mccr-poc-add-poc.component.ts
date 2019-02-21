import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AbstractControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MccrPocService } from '@app/mccr/mccr-poc/mccr-poc.service';
import { finalize, tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material';
import { Logger } from '@app/core';

const log = new Logger('Report');

@Component({
  selector: 'app-mccr-poc-add-poc',
  templateUrl: './mccr-poc-add-poc.component.html',
  styleUrls: ['./mccr-poc-add-poc.component.scss']
})
export class MccrPocAddPocComponent implements OnInit {

  isLoading = false;
  error: string;
  form: FormGroup;
  
  

  constructor(private route: ActivatedRoute,private formBuilder: FormBuilder,private reportService: MccrPocService,
    private service: MccrPocService,private router: Router,private translateService: TranslateService,public snackBar: MatSnackBar) { 
    this.createForm();
  }

  ngOnInit() {
    
  }

  submitForm(){
    this.isLoading = true;
    this.service.submitNewUcc(this.form.value)
    .pipe(finalize(() => {
      this.form.markAsPristine();
      this.isLoading = false;
    }))
    .subscribe(response => {
      this.router.navigate([`/mccr/poc/detail/${this.form.value.uccBatchCode}`], { replaceUrl: true });
      this.translateService.get('Sucessfully submitted form').subscribe((res: string) => { this.snackBar.open(res, null, {duration: 3000 }); });
      log.debug(`${response.statusCode} status code received from form`);

    }, error => {
      log.debug(`Mccr Registry File error: ${error}`);
      this.error = error;
    });


  }

  createForm(){

    this.form = this.formBuilder.group({
      uccBatchCode: ['', Validators.required],
      uccBatchSize: ['', Validators.required]
    });

  }

}
